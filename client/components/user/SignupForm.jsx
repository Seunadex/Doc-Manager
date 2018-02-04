import React from 'react';
import PropTypes from 'prop-types';

class SignupForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fullName: '',
      username: '',
      email: '',
      password: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const { onUserSignup } = this.props;
    const { username, password, email, fullName } = this.state;

    onUserSignup({
      username,
      password,
      email,
      fullName
    });
  }

  render() {
    return (
      <div>
        <form className="col s12">
          <div className="row">
            <div className="input-field col s12">
              <i className="material-icons prefix">account_circle</i>
              <input
                id="icon_prefix"
                type="text"
                value={this.state.fullName}
                onChange={this.onChange}
                name="fullName"
                className="validate" required autoFocus />
              <label htmlFor="icon_prefix">Full Name</label>
            </div>
            <div className="input-field col s12">
              <i className="material-icons prefix">person_pin</i>
              <input
                type="text"
                value={this.state.username}
                onChange={this.onChange}
                name="username"
                className="validate" required />
              <label htmlFor="username">Username</label>
            </div>
            <div className="input-field col s12">
              <i className="material-icons prefix">email</i>
              <input
                id="email"
                type="email"
                value={this.state.email}
                onChange={this.onChange}
                name="email"
                className="validate" required />
              <label htmlFor="email">Email Address</label>
            </div>
            <div className="input-field col s12">
              <i className="material-icons prefix">lock</i>
              <input
                type="password"
                value={this.state.password}
                onChange={this.onChange}
                name="password"
                className="validate" required />
              <label htmlFor="password">Password</label>
            </div>
          </div>
          <button
            onClick={this.onSubmit}
            className="waves-effect waves-teal btn col s12">
                Sign up
          </button>

        </form>
      </div>

    );
  }
}

SignupForm.propTypes = {
  onUserSignup: PropTypes.func.isRequired
};

export default SignupForm;
