import React from 'react';
import { Link } from 'react-router-dom';
import { BiHomeSmile } from 'react-icons/bi';
import kamon from '../kamon.png';

const Header = props => {
  return (
    <h1 className="text-4xl">
      <Link to="/">
        {/* <kamon className="inline-block align-top" /> */}
        <img src={kamon} className="inline-block align-top kamon" />
      </Link>
      <div className="inline-block mt-1">
        <Link to="/">Projects</Link>
        &nbsp;
        <Link to="/articles">Articles</Link>
        &nbsp;
        <Link to="/about">About</Link>
      </div>
    </h1>
  );
};

export default Header;
