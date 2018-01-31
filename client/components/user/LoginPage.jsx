import React from 'react';
import PropTypes from 'prop-types';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col m7"><h1>Login Page</h1></div>
            <div className="col m5">
              <div className="login-form z-depth-5">
                <img
                  src="./../../images/login_key1.png"
                  alt="login"
                  className="login-img" />
                <div className="row">
                  <form className="col s12">
                    <div className="row">
                      <div className="input-field col s12">
                        <i className="material-icons prefix">person_pin</i>
                        <input
                        id="username"
                        type="text"
                        className="validate" required />
                        <label htmlFor="username">Username</label>
                      </div>
                      <div className="input-field col s12">
                        <i className="material-icons prefix">lock</i>
                        <input
                        id="password"
                        type="password"
                        className="validate" required />
                        <label htmlFor="password">Password</label>
                      </div>
                    </div>
                    <button className="waves-effect waves-teal btn col s12">
                        Login
                      </button>

                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
