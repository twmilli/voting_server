'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var front = 'http://project-vote.surge.sh';
var back = 'https://dashboard.heroku.com/apps/vote-backend';

if (process.env.NODE_ENV != "production") {
  front = 'http://localhost:8080';
  back = 'http://localhost:3000';
}
exports.default = {
  user: 'project-vote@outlook.com',
  pass: 'sw@gmoney#B0bberB0y',
  front: front,
  back: back
};