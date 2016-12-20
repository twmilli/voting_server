'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passwordless = require('passwordless');

var _passwordless2 = _interopRequireDefault(_passwordless);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/logout', _passwordless2.default.logout());

routes.post('/sendtoken', _passwordless2.default.requestToken(function (user, delivery, callback) {
  callback(null, user);
}), function (req, res) {
  res.send();
});

module.exports = router;