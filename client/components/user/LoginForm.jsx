import React from 'react';
import PropTypes from 'prop-types';


class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
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
    const { onUserLogin } = this.props;
    const { username, password } = this.state;

    onUserLogin({
      username,
      password
    });
  }

  render() {
    return (
      <div>
        <form className="col s12">
          <div className="row">
            <div className="input-field col s12">
              <i className="material-icons prefix">person_pin</i>
              <input
                id="username"
                type="text"
                value={this.state.username}
                onChange={this.onChange}
                name="username"
                autoFocus required />
              <label htmlFor="username">Username</label>
            </div>
            <div className="input-field col s12">
              <i className="material-icons prefix">lock</i>
              <input
                id="password"
                type="password"
                value={this.state.password}
                onChange={this.onChange}
                name="password" required />
              <label htmlFor="password">Password</label>
            </div>
          </div>
          <button onClick={this.onSubmit} className="waves-effect waves-teal btn col s12">
            Login
          </button>
        </form>
      </div>
    );
  }
}

LoginForm.PropTypes = {
  onUserLogin: PropTypes.func.isRequired
};

export default LoginForm;
