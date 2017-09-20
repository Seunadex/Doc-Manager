import React from 'react';
import { Link } from 'react-router';

const Navbar = () => {
  return (
    <nav>
      <div className="container">
        <div className="nav-wrapper">
          <a href="/" className="brand-logo hide-on-med-and-down">Doc-Man</a>
          <ul id="nav-mobile" className="right">
            <li><Link to="/login" activeClassName="active">Login</Link></li>
            <li><Link to="/signup" activeClassName="active">Signup</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

