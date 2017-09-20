import React from 'react';

/**
 *
 *
 * @class DashboardPage
 * @extends {React.Component}
 */
class DashboardPage extends React.Component {
  /**
   *
   *
   * @returns
   * @memberof DashboardPage
   */
  render() {
    return (
      <div className="dashboard">
        <div className="overlay">
          <h1>This will be the HomePage</h1>
          <h2>Welcome to my Document Management System</h2>
          <p>This application uses React, Redux,</p>
        </div>
      </div>
    );
  }
}

export default DashboardPage;
