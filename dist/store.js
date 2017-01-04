'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _index = require('./reducers/index');

var _index2 = _interopRequireDefault(_index);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INITIAL_STATE = (0, _immutable.fromJS)([{
  "creator": 'twm013@bucknell.edu',
  title: "Favorite Color?",
  choices: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
  tally: {
    Red: 6,
    Blue: 3,
    Green: 2,
    Yellow: 4,
    Purple: 6
  }
}]);

var store = (0, _redux.createStore)(_index2.default, INITIAL_STATE);

exports.default = store;