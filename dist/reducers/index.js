'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.topics = topics;

var _reduxImmutable = require('redux-immutable');

var _immutable = require('immutable');

var _core = require('./core');

//heroku config | grep MONGODB_URI

function topics() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments[1];

  switch (action.type) {
    case 'SET_STATE':
      return (0, _immutable.fromJS)(action.state);
    case 'ADD_TOPIC':
      return (0, _core.addTopic)(state, action.title, action.choices, action.creator);
    case 'DELETE':
      return (0, _core.delete_topic)(state, action.i);
    case 'VOTE':
      return (0, _core.vote)(state, action.index, action.choice);
    case 'ADD_CHOICE':
      return (0, _core.addChoice)(state, action.i, action.choice);
  }
  return (0, _immutable.fromJS)(state);
}
exports.default = topics;