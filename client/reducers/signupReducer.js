import { SIGN_UP, SIGN_UP_FAIL } from '../constants';

export default (state = {}, action) => {
  switch (action.type) {
    case SIGN_UP:
      console.log(action);
      return {
        ...state,
        status: 'Success',
        message: action.payload.data,
        ...action.payload.data
      };
    case SIGN_UP_FAIL:
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
