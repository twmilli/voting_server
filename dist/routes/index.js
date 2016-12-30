'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _passwordless = require('passwordless');

var _passwordless2 = _interopRequireDefault(_passwordless);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var urlencodedParser = _bodyParser2.default.urlencoded({ extended: false });


router.get('/logout', _passwordless2.default.logout());

router.get('/favicon.ico', function (req, res) {
  res.sendStatus(200);
});
//fix favicon at some point
router.get('/login', function (req, res) {
  if (req.user) {
    var end_index = req.user.search('@');
    var username = req.user.slice(0, end_index);
    res.redirect(_config2.default.front + '/' + username);
  } else {
    res.send(null);
  }
});

router.get('/restricted', _passwordless2.default.restricted({
  failureRedirect: '/login'
}), function (req, res) {
  res.render('pages/restricted', { user: req.user });
});

router.post('/sendtoken', _bodyParser2.default.json(), function (req, res, next) {
  next();
}, _passwordless2.default.requestToken(
// Simply accept every user
function (user, delivery, callback) {
  debugger;
  callback(null, user);
}), function (req, res) {
  res.send('success');
});

router.get('/', function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>VOTING SERVER</h1>\n      <a href="http://project-vote.surge.sh/">http://project-vote.surge.sh/</a>');
  res.end();
});

exports.default = router;