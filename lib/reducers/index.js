import {combineReducers} from 'redux-immutable';
import {fromJS} from 'immutable';
import {addTopic,vote,delete_topic, addChoice} from './core';

//heroku config | grep MONGODB_URI

export function topics(state=[], action){
  switch(action.type){
    case 'SET_STATE':
      return (fromJS(action.state));
    case 'ADD_TOPIC':
      return addTopic(state,action.title,action.choices, action.creator);
    case 'DELETE':
      return delete_topic(state, action.i);
    case 'VOTE':
      return vote(state,action.index,action.choice)
    case 'ADD_CHOICE':
      return addChoice(state, action.i, action.choice);
  }
  return fromJS(state);
}
export default topics
