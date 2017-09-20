import React from 'react';

/**
 *
 *
 * @class DashboardPage
 * @extends {React.Component}
 */
class DocumentPage extends React.Component {
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
          <h1>This will be the document Page</h1>
          <p>This will display all the documents</p>
        </div>
      </div>
    );
  }
}

export default DocumentPage;
