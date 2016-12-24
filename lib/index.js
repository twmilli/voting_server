import express from 'express';
var app = express();
import {
    Server
} from 'http';
const http = Server(app);
var https = require('https');
https.globalAgent.options.secureProtocol = 'SSLv3_method';
const io = require('socket.io')(http);
const port = 3000;
import store from './store.js';
const mongo = require("mongodb").MongoClient;
const db_url = process.env.MONGODB_URI;
import {
    setState
} from './actions/actionCreators';
import middleware from './middleware.js';

import passwordless from 'passwordless';
import MongoStore from 'passwordless-mongostore-bcrypt-node';
import email from 'emailjs';
import routes from './routes/index';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import logger from 'morgan';
import path from 'path';

// Disable x-powered-by header which shows what software server is running (express);
app.disable('x-powered-by');


//connect to database and load the most recently saved state into the store
mongo.connect(db_url, (err, db) => {
    if (err) throw err;
    db.collection("state")
        .find({
            _id: 1
        }).stream().on('data', (data) => {
            const start_state = data.state;
            if (start_state !== undefined) {
                store.dispatch(setState(start_state));
            }

        });

    /*every time there is a change to the store:
    1. update mongodb
    2. send the state to all of the connected sockets*/
    store.subscribe(
        () => {
            db.collection("state").update({
                "_id": 1
            }, {
                "_id": 1,
                state: store.getState().toJS()
            }, {
                upsert: true
            })
            io.emit('state', store.getState().toJS());
        }
    )

    const myEmail = 'project-vote@outlook.com'
    const myPassword = process.env.PASSWORD;
    const mySmtp = 'smtp-mail.outlook.com';
    var smtpServer = email.server.connect({
        user: myEmail,
        password: myPassword,
        timeout: 6000,
        host: mySmtp,
        port: 587,
        tls:     {ciphers: "SSLv3"}
    });

    smtpServer.send({
      text:'TEST',
      from: myEmail,
      to: 'twm013@bucknell.edu',
      subject: 'TEST'
    }, function(err, message){
      console.log(err || message);
    });

    const host = 'https://vote-backend.herokuapp.com/';

    passwordless.init(new MongoStore(db_url));
    passwordless.addDelivery(
        function(tokenToSend, uidToSend, recipient, callback) {
            console.log("SENDING");
            const tokenLink = host + '?token=' + tokenToSend + '&uid=' + encodeURIComponent(uidToSend)
            smtpServer.send({
                text: 'Hello!\nYou can now access your account here: ' +
                    tokenLink,
                from: myEmail,
                to: recipient,
                subject: 'Token for ' + host
            }, function (err, message) {
                if (err) {
                    console.log(err);
                }
                callback(err);
            });
        });
    //app.use(logger('dev'));
    app.use(middleware);
    app.use(cookieParser());
    app.use(expressSession({
        secret: '42',
        saveUninitialized: false,
        resave: false
    }));
    //app.use(express.static(path.join(__dirname, 'public')));

    app.use(passwordless.sessionSupport());
    app.use(passwordless.acceptToken());
    app.use('/', routes);


    io.on('connection', (socket) => {
        //console.log('CONNECTED TO CLIENT', socket.id);
        socket.emit('state', store.getState());
        socket.on('action', store.dispatch.bind(store));
    });

    app.set('port', (process.env.PORT || port));

    http.listen(app.get('port'), () => {
        console.log('listening on port: ' + app.get('port'));
    });

});
