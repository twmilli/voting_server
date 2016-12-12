import {combineReducers} from 'redux-immutable';
import {fromJS} from 'immutable';
import {addTopic,vote} from './core';

const INITIAL_STATE = fromJS({
  topics:[
    {
      title: "Favorite Color?",
      choices:['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
      tally:{
        Red: 6,
        Blue: 3,
        Green: 2,
        Yellow: 4,
        Purple: 6
      }
    }
  ]
});

export function topics(state=INITIAL_STATE, action){
  switch(action.type){
    case 'SET_STATE':
      return (fromJS(action.state));
    case 'ADD_TOPIC':
      return addTopic(state,action.title,action.choices);
    case 'VOTE':
      return vote(state,action.index,action.choice)
  }
}
export default combineReducers({topics});
