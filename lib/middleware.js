// Add headers
// Source: http://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue
import config from './config';
export default function (req, res, next) {

  // Currently allows access from any origin
  console.log(config.front);
  console.log(process.env.NODE_ENV);
  res.setHeader('Access-Control-Allow-Origin', config.front);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');


  // Pass to next layer of middleware
  next();
};
