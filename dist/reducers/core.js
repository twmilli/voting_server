'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vote = vote;
exports.addTopic = addTopic;
exports.delete_topic = delete_topic;
exports.addChoice = addChoice;

var _immutable = require('immutable');

function vote(state, index, choice) {
  return state.updateIn([index, 'tally', choice], 0, function (tally) {
    return tally + 1;
  });
}

function addTopic(state, title, choices, creator) {
  return state.push((0, _immutable.fromJS)({
    creator: creator,
    title: title,
    choices: choices,
    tally: {}
  }));
}

function delete_topic(state, i) {
  return state.delete(i);
}

function addChoice(state, index, choice) {
  console.log(choice);
  return state.updateIn([index, 'choices'], function (choices) {
    return choices.push(choice);
  });
}