import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import SignupForm from './SignupForm';
import userSignupRequest from '../../actions/signupActions';

class SignupPage extends React.Component {
  render() {
    const { onUserSignup, userDetails } = this.props;

    userDetails && console.log(userDetails);

    return (
      <div className="container">
        <div className="row">
          <div className="col m6"><h1>Signup Page</h1></div>
          <div className="col m6">
            <div className="signup-form z-depth-5">
              <div className="login-img" />
              <div className="row">
                <SignupForm onUserSignup={onUserSignup} />
              </div>
              <p>Already registered? Login <Link to="/login">here</Link></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
SignupPage.propTypes = {
  onUserSignup: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUserSignup: (userData) => {
      dispatch(userSignupRequest(userData));
    }
  };
};

const mapStateToProps = ({ userDetails }) => ({
  userDetails
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupPage);
