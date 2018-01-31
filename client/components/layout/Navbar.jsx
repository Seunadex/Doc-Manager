import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <div className="container">
        <div className="nav-wrapper">
          <Link to="/" className="brand-logo hide-on-med-and-down">Doc-Man</Link>
          <ul id="nav-mobile" className="right">
            <li><Link to="/login" className="active">Login</Link></li>
            <li><Link to="/signup" className="active">Signup</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

