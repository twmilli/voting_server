'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passwordless = require('passwordless');

var _passwordless2 = _interopRequireDefault(_passwordless);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });


router.get('/logout', _passwordless2.default.logout());

router.get('/favicon.ico', function (req, res) {
  res.sendStatus(200);
});
//fix favicon at some point

router.post('/sendtoken', bodyParser.json(), function (req, res, next) {
  console.log(req.body);
  next();
}, _passwordless2.default.requestToken(
// Simply accept every user
function (user, delivery, callback, req) {
  console.log(req.body);
  callback(null, user);
}), function (req, res) {
  console.log("SENT");
  res.render('sent');
});

router.get('/', function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>VOTING SERVER</h1>\n      <a href="http://project-vote.surge.sh/">http://project-vote.surge.sh/</a>');
  res.end();
});

exports.default = router;