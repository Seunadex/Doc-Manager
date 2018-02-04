import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import userLoginRequest from '../../actions/loginActions';
import LoginForm from './LoginForm';


class LoginPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { onUserLogin, userDetails } = this.props;
    userDetails && console.log(userDetails);

    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col m6"><h1>Login Page</h1></div>
            <div className="col m6">
              <div className="login-form z-depth-5">
                <div className="login-img" />
                <div className="row">
                  <LoginForm onUserLogin={onUserLogin} />
                </div>
                <p>Don't have an account yet? Signup <Link to="/signup">here</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  onUserLogin: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUserLogin: (userData) => {
      dispatch(userLoginRequest(userData));
    }
  };
};

const mapStateToProps = ({ userDetails }) => ({
  userDetails
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
