import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SignupForm from './SignupForm';
import userSignupRequest from '../../actions/signupActions';

class SignupPage extends React.Component {
  render() {
    const { onUserSignup, userDetails } = this.props;

    userDetails && console.log(userDetails);

    return (
      <div className="container">
        <div className="row">
          <div className="col m7"><h1>Signup Page</h1></div>
          <div className="col m5">
            <div className="signup-form z-depth-5">
              <img
                  src="./../../images/signup.png"
                  alt="login"
                  className="signup-img" />
              <div className="row">
                <SignupForm onUserSignup={onUserSignup} />
              </div>
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
