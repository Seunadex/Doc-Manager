import React, { PropTypes } from 'react';
import Navbar from './layout/Navbar';

/**
 *
 *
 * @class App
 * @extends {React.Component}
 */
class App extends React.Component {
  /**
   *
   *
   * @returns
   * @memberof App
   */
  render() {
    return (
      <div>
        <Navbar />
        {this.props.children}
        <footer className="page-footer">
          <div className="footer-copyright">
            <div className="container">
      © 2017 Copyright <strong>Seun Adekunle</strong>
              <a
              className="grey-text text-lighten-4 right"
              href="https://www.github.com/seunadex"
              target="_blank"
              rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
};

export default App;
