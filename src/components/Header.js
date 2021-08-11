import React from 'react';
import { Link } from 'react-router-dom';
// import { BiHomeSmile } from 'react-icons/bi';
import kamon from '../kamon.png';

const Header = props => {
  return (
    <h1 className="text-4xl">
      <Link to="/">
        {/* <kamon className="inline-block align-top" /> */}
        <img src={kamon} className="inline-block align-top kamon" alt="logo" />
      </Link>
      <div className="inline-block mt-1 divide-x-2">
        <Link className="px-3" to="/">
          Projects
        </Link>
        {/* &nbsp; */}
        <Link className="px-3" to="/articles">
          Articles
        </Link>
        {/* &nbsp; */}
        <Link className="px-3" to="/about">
          About
        </Link>
      </div>
    </h1>
  );
};

export default Header;
