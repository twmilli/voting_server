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

var _routes = require('routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var http = (0, _http.Server)(app);
var io = require('socket.io')(http);
var port = 3000;

var mongo = require("mongodb").MongoClient;
var db_url = process.env.MONGODB_URI;


app.get('/favicon.ico', function (req, res) {
  res.sendStatus(200);
});

// Disable x-powered-by header which shows what software server is running (express);
app.disable('x-powered-by');

app.use(_middleware2.default);
app.use('/', _routes2.default);
app.use(_passwordless2.default.sessionSupport());
app.use(_passwordless2.default.acceptToken({ successRedirect: '/acceptToken' }));

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

  var myEmail = 'project-vote@outlook.com';
  var password = process.env.PASSWORD;
  var smtp = 'smtp-mail.outlook.com';
  var smtpServer = _emailjs2.default.server.connect({
    user: myEmail,
    password: password,
    timeout: 60000,
    host: smtp,
    ssl: true
  });

  var host = 'https://vote-backend.herokuapp.com/';

  _passwordless2.default.init(new _passwordlessMongostoreBcryptNode2.default(db_url));
  _passwordless2.default.addDelivery(function (tokenToSend, uidToSend, recipient, callback) {
    smtpServer.send({
      text: 'Hello!\nYou can now access your account here: ' + host + '?token=' + tokenToSend + '&uid=' + encodeURIComponent(uidToSend),
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

  /*every time there is a change to the store:
  1. update mongodb
  2. send the state to all of the connected sockets*/
  _store2.default.subscribe(function () {
    db.collection("state").update({ "_id": 1 }, { "_id": 1, state: _store2.default.getState().toJS() }, { upsert: true });
    io.emit('state', _store2.default.getState().toJS());
  });
});
app.get('/favicon.ico', function (req, res) {
  res.sendStatus(200);
});
//fix favicon at some point
app.get('*', function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>VOTING SERVER</h1>\n      <a href="http://project-vote.surge.sh/">http://project-vote.surge.sh/</a>');
  res.end();
});

io.on('connection', function (socket) {
  //console.log('CONNECTED TO CLIENT', socket.id);
  socket.emit('state', _store2.default.getState());
  socket.on('action', _store2.default.dispatch.bind(_store2.default));
});

app.set('port', process.env.PORT || port);

http.listen(app.get('port'), function () {
  console.log('listening on port: ' + app.get('port'));
});