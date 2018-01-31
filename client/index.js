import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';


import { Routes, history } from './routes';
import reducers from './reducers/rootReducer';
import './components/styles/styles.scss';

const createStoreWithMiddleware =
applyMiddleware(thunk)(createStore);

render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <Router history={history}>
      <Routes />
    </Router>
  </Provider>,
   document.getElementById('app')
  );
