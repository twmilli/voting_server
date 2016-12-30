'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (req, res, next) {

  // Currently allows access from any origin
  console.log(_config2.default.front);
  console.log(process.env.NODE_ENV);
  res.setHeader('Access-Control-Allow-Origin', _config2.default.front);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Pass to next layer of middleware
  next();
};

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Add headers
// Source: http://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue
;