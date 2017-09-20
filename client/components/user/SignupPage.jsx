import React from 'react';

class SignupPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col m7"><h1>Signup Page</h1></div>
            <div className="col m5">
              <div className="signup-form z-depth-5">
                <img
                  src="./../../images/signup.png"
                  alt="login"
                  className="login-img" />
                <div className="row">
                  <form className="col s12">
                    <div className="row">
                      <div className="input-field col s12">
                        <i className="material-icons prefix">account_circle</i>
                        <input
                        id="icon_prefix"
                        type="text"
                        className="validate" />
                        <label htmlFor="icon_prefix">Full Name</label>
                      </div>
                      <div className="input-field col s12">
                        <i className="material-icons prefix">person_pin</i>
                        <input
                        id="icon_telephone"
                        type="tel"
                        className="validate" />
                        <label htmlFor="icon_telephone">Username</label>
                      </div>
                      <div className="input-field col s12">
                        <i className="material-icons prefix">email</i>
                        <input
                        id="icon_telephone"
                        type="tel"
                        className="validate" />
                        <label htmlFor="email">Email Address</label>
                      </div>
                      <div className="input-field col s12">
                        <i className="material-icons prefix">lock</i>
                        <input
                        id="icon_telephone"
                        type="tel"
                        className="validate" />
                        <label htmlFor="password">Password</label>
                      </div>
                    </div>
                    <a className="waves-effect waves-teal btn col s12">
                        Sign up
                      </a>

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

export default SignupPage;
