import {createStore} from 'redux';
import rootReducer from './reducers/index';
import {fromJS} from 'immutable';


const store = createStore(rootReducer);

export default store;
