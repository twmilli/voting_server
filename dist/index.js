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

var _passwordlessMongostore = require('passwordless-mongostore');

var _passwordlessMongostore2 = _interopRequireDefault(_passwordlessMongostore);

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

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var http = (0, _http.Server)(app);
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
    var smtpConfig = {
        service: "hotmail",
        auth: _config2.default
    };
    var transporter = _nodemailer2.default.createTransport(smtpConfig);
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log('SERVER IS READY');
        }
    });

    /*transporter.sendMail({
      text: 'WORK',
      from: config.user,
      to: 'twmilli@comcast.net',
      subject: 'TEST'
    }, function (err, message) {
        if (err) {
            console.log(err);
        }
    });*/

    var host = _config2.default.back;

    _passwordless2.default.init(new _passwordlessMongostore2.default(db_url));
    _passwordless2.default.addDelivery(function (tokenToSend, uidToSend, recipient, callback) {
        var tokenLink = host + '?token=' + tokenToSend + '&uid=' + encodeURIComponent(uidToSend);
        transporter.sendMail({
            text: 'Hello!\nYou can now access your account here:' + tokenLink,
            from: _config2.default.user,
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
    app.use(_passwordless2.default.acceptToken({ successRedirect: '/login' }));
    app.use('/', _index2.default);

    io.on('connection', function (socket) {
        socket.emit('state', _store2.default.getState());
        socket.on('action', _store2.default.dispatch.bind(_store2.default));
    });

    app.set('port', process.env.PORT || port);

    http.listen(app.get('port'), function () {
        console.log('listening on port: ' + app.get('port'));
    });
});