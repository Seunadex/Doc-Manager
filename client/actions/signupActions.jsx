import axios from 'axios';
import { history } from '../routes';
// import jwt from 'jsonwebtoken';
import setToken from '../utils/setToken';

import { SIGN_UP, SIGN_UP_FAIL, SIGNED_UP } from '../constants';

export default (userData) => {
  return (dispatch) => {
    const url = '/api/v1/users';
    axios.post(url, userData).then((response) => {
      const token = response.data.token;
      console.log(token);
      localStorage.setItem('jwtToken', token);
      setToken(token);
      dispatch({ type: SIGN_UP, payload: response.data });
      history.push('/documents');
    })
    .catch((error) => {
      console.log(error.response.data);
      dispatch({ type: SIGN_UP_FAIL, payload: error.response.data });
      history.push('/signup');
    });
  };
};

