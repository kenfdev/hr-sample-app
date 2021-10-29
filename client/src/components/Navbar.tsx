import React from 'react';
import { Link } from 'react-router-dom';

export type UserInfo = {
  username: string;
  userMenus: string[];
};

type Props = {
  userInfo: UserInfo;
  onLogout: () => void;
};

const Navbar: React.FC<Props> = (props) => {
  const renderUserMenus = () => {
    return props.userInfo.userMenus.map((menu) => (
      <a
        key={menu}
        className="navbar-item"
        onClick={() => {
          alert('Not Implemented!');
        }}
      >
        {menu}
      </a>
    ));
  };
  return (
    <nav className="navbar mb-6" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <span className="navbar-item">HR</span>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <Link className="navbar-item" to="/members">
            Home
          </Link>
        </div>

        <div className="navbar-end">
          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link">
              <span className="icon mr-1">
                <i className="fas fa-user"></i>
              </span>
              {props.userInfo.username}
            </a>
            <div className="navbar-dropdown">
              {renderUserMenus()}
              <a
                className="navbar-item is-hoverable is-clickable"
                onClick={props.onLogout}
              >
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
