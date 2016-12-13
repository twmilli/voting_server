import {createStore} from 'redux';
import rootReducer from './reducers/index';
import {fromJS} from 'immutable';

const INITIAL_STATE = fromJS([
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
);

const store = createStore(rootReducer, INITIAL_STATE);

export default store;
