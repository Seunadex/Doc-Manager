import axios from 'axios';
import { history } from '../routes';
import setToken from '../utils/setToken';

import { LOGIN, LOGIN_FAIL } from '../constants';

export default (userData) => {
  return (dispatch) => {
    const url = '/api/v1/users/login';
    axios.post(url, userData).then((response) => {
      const token = response.data.token;
      console.log(token);
      localStorage.setItem('jwtToken', token);
      setToken(token);
      dispatch({ type: LOGIN, payload: response.data });
      history.push('/documents');
    })
    .catch((error) => {
      console.log(error.response.data);
      dispatch({ type: LOGIN_FAIL, payload: error.response.data });
      history.push('/login');
    });
  };
};

