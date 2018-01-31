import React from 'react';
import PropTypes from 'prop-types';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';

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
        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
};

export default App;
