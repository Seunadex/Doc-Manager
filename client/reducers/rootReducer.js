import { combineReducers } from 'redux';

import signUpReducer from './signupReducer';
import loginReducer from './loginReducer';

export default combineReducers({
  signUpReducer,
  loginReducer
});
