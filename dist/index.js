'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _store = require('./store.js');

var _store2 = _interopRequireDefault(_store);

var _actionCreators = require('./actions/actionCreators');

var _middleware = require('./middleware.js');

var _middleware2 = _interopRequireDefault(_middleware);

var _passwordless = require('passwordless');

var _passwordless2 = _interopRequireDefault(_passwordless);

var _passwordlessMongostoreBcryptNode = require('passwordless-mongostore-bcrypt-node');

var _passwordlessMongostoreBcryptNode2 = _interopRequireDefault(_passwordlessMongostoreBcryptNode);

var _emailjs = require('emailjs');

var _emailjs2 = _interopRequireDefault(_emailjs);

var _index = require('./routes/index');

var _index2 = _interopRequireDefault(_index);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var http = (0, _http.Server)(app);
var https = require('https');
https.globalAgent.options.secureProtocol = 'SSLv3_method';
var io = require('socket.io')(http);
var port = 3000;

var mongo = require("mongodb").MongoClient;
var db_url = process.env.MONGODB_URI;


// Disable x-powered-by header which shows what software server is running (express);
app.disable('x-powered-by');

//connect to database and load the most recently saved state into the store
mongo.connect(db_url, function (err, db) {
    if (err) throw err;
    db.collection("state").find({
        _id: 1
    }).stream().on('data', function (data) {
        var start_state = data.state;
        if (start_state !== undefined) {
            _store2.default.dispatch((0, _actionCreators.setState)(start_state));
        }
    });

    /*every time there is a change to the store:
    1. update mongodb
    2. send the state to all of the connected sockets*/
    _store2.default.subscribe(function () {
        db.collection("state").update({
            "_id": 1
        }, {
            "_id": 1,
            state: _store2.default.getState().toJS()
        }, {
            upsert: true
        });
        io.emit('state', _store2.default.getState().toJS());
    });

    var myEmail = 'project-vote@outlook.com';
    var myPassword = process.env.PASSWORD;
    var mySmtp = 'smtp-mail.outlook.com';
    var smtpServer = _emailjs2.default.server.connect({
        user: myEmail,
        password: myPassword,
        timeout: 6000,
        host: mySmtp,
        port: 587,
        tls: { ciphers: "SSLv3" }
    });

    smtpServer.send({
        text: 'TEST',
        from: myEmail,
        to: 'twm013@bucknell.edu',
        subject: 'TEST'
    }, function (err, message) {
        console.log(err || message);
    });

    var host = 'https://vote-backend.herokuapp.com/';

    _passwordless2.default.init(new _passwordlessMongostoreBcryptNode2.default(db_url));
    _passwordless2.default.addDelivery(function (tokenToSend, uidToSend, recipient, callback) {
        console.log("SENDING");
        var tokenLink = host + '?token=' + tokenToSend + '&uid=' + encodeURIComponent(uidToSend);
        smtpServer.send({
            text: 'Hello!\nYou can now access your account here: ' + tokenLink,
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
    app.use(_middleware2.default);
    app.use((0, _cookieParser2.default)());
    app.use((0, _expressSession2.default)({
        secret: '42',
        saveUninitialized: false,
        resave: false
    }));
    //app.use(express.static(path.join(__dirname, 'public')));

    app.use(_passwordless2.default.sessionSupport());
    app.use(_passwordless2.default.acceptToken());
    app.use('/', _index2.default);

    io.on('connection', function (socket) {
        //console.log('CONNECTED TO CLIENT', socket.id);
        socket.emit('state', _store2.default.getState());
        socket.on('action', _store2.default.dispatch.bind(_store2.default));
    });

    app.set('port', process.env.PORT || port);

    http.listen(app.get('port'), function () {
        console.log('listening on port: ' + app.get('port'));
    });
});