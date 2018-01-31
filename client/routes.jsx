import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import App from './components/App';
import LoginPage from './components/user/LoginPage';
import SignupPage from './components/user/SignupPage';
import DocumentPage from './components/document/DocumentPage';

export const history = createBrowserHistory();

export const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/signup" component={SignupPage} />
      <Route exact path="/documents" component={DocumentPage} />
    </Switch>
  );
};

