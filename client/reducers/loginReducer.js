import { LOGIN, LOGIN_FAIL } from '../constants';

export default (state = {}, action) => {
  switch (action.type) {
    case LOGIN:
      console.log(action);
      return {
        ...state,
        status: 'Success',
        message: action.payload.data,
        ...action.payload.data
      };
    case LOGIN_FAIL:
      return {
        ...state,
        status: 'Unsuccessful' || undefined,
        ...action.payload,
        authenticated: false
      };

    default:
      return state;
  }
};
