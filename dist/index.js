'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _store = require('./store.js');

var _store2 = _interopRequireDefault(_store);

var _actionCreators = require('./actions/actionCreators');

var _middleware = require('./middleware.js');

var _middleware2 = _interopRequireDefault(_middleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var http = (0, _http.Server)(app);
var io = require('socket.io')(http);
var port = 3000;

var mongo = require("mongodb").MongoClient;
var db_url = process.env.MONGODB_URI;


app.get('/favicon.ico', function (req, res) {
  res.send(200);
});

// Disable x-powered-by header which shows what software server is running (express);
app.disable('x-powered-by');

app.use(_middleware2.default);

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
    db.collection("state").update({ "_id": 1 }, { "_id": 1, state: _store2.default.getState().toJS() }, { upsert: true });
    io.emit('state', _store2.default.getState().toJS());
  });
});
app.get('/favicon.ico', function (req, res) {
  res.sendStatus(200);
});
app.use(_express2.default.static(__dirname + '/View'));
//fix favicon at some point
app.get('*', function (req, res) {
  res.sendFile('index.html');
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