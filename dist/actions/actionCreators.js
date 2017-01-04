'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setState = setState;
exports.delete_topic = delete_topic;
exports.addTopic = addTopic;
exports.addChoice = addChoice;
function setState(state) {
  return {
    type: 'SET_STATE', state: state
  };
}

function delete_topic(i) {
  return {
    type: 'DELETE', i: i, meta: { remote: true }
  };
}

function addTopic(title, choices, creator) {
  return {
    type: 'ADD_TOPIC', title: title, choices: choices, creator: creator, meta: { remote: true }
  };
}

function addChoice(i, choice) {
  return {
    type: 'ADD_CHOICE', i: i, choice: choice, meta: { remote: true }
  };
}