'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vote = vote;
exports.addTopic = addTopic;

var _immutable = require('immutable');

function vote(state, index, choice) {
  return state.updateIn([index, 'tally', choice], 0, function (tally) {
    return tally + 1;
  });
}

function addTopic(state, title, choices) {
  return state.push((0, _immutable.fromJS)({
    title: title,
    choices: choices,
    tally: {}
  }));
}