import React from 'react';

class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
      username: '',
      email: '',
      password: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.userSignupRequest(this.state);
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
                  className="signup-img" />
                <div className="row">
                  <form className="col s12" onSubmit={this.onSubmit}>
                    <div className="row">
                      <div className="input-field col s12">
                        <i className="material-icons prefix">account_circle</i>
                        <input
                        id="icon_prefix"
                        type="text"
                        value={this.state.fullName}
                        onChange={this.onChange}
                        name="fullName"
                        className="validate" />
                        <label htmlFor="icon_prefix">Full Name</label>
                      </div>
                      <div className="input-field col s12">
                        <i className="material-icons prefix">person_pin</i>
                        <input
                        id="icon_telephone"
                        type="text"
                        value={this.state.username}
                        onChange={this.onChange}
                        name="username"
                        className="validate" />
                        <label htmlFor="icon_telephone">Username</label>
                      </div>
                      <div className="input-field col s12">
                        <i className="material-icons prefix">email</i>
                        <input
                        id="icon_telephone"
                        type="email"
                        value={this.state.email}
                        onChange={this.onChange}
                        name="email"
                        className="validate" />
                        <label htmlFor="email">Email Address</label>
                      </div>
                      <div className="input-field col s12">
                        <i className="material-icons prefix">lock</i>
                        <input
                        id="icon_telephone"
                        type="password"
                        value={this.state.password}
                        onChange={this.onChange}
                        name="password"
                        className="validate" />
                        <label htmlFor="password">Password</label>
                      </div>
                    </div>
                    <a
                    onClick={this.onSubmit}
                    className="waves-effect waves-teal btn col s12">
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

SignupForm.propTypes = {
  userSignupRequest: React.PropTypes.func.isRequired
};

export default SignupForm;
