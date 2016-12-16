'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setState = setState;
function setState(state) {
  return {
    type: 'SET_STATE', state: state
  };
}