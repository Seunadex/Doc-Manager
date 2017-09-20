import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import DashboardPage from './components/DashboardPage';
import LoginPage from './components/user/LoginPage';
import SignupPage from './components/user/SignupPage';
import DocumentPage from './components/document/DocumentPage';

export default (
  <Route path="/"component={App}>
    <IndexRoute component={DashboardPage} />
    <Route path="/login" component={LoginPage} />
    <Route path="/signup" component={SignupPage} />
    <Route path="/documents" component={DocumentPage} />
  </Route>
);
