import React from 'react';
import { Link } from 'react-router-dom';
// import { BiHomeSmile } from 'react-icons/bi';
import kamon from '../kamon.png';

const Header = props => {
  return (
    <h1 className="xl:text-3xl 2xl:text-4xl">
      <Link to="/about">
        {/* <kamon className="inline-block align-top" /> */}
        <img src={kamon} className="kamon" alt="logo" />
      </Link>
      <div className="inline-block divide-x-2 mt-2.5 xl:mt-1 2xl:mt-3">
        <Link className="px-3" to="/about">
          About
        </Link>
        <Link className="px-3" to="/projects">
          Projects
        </Link>
        <Link className="px-3" to="/cranestory">
          Crane Story
        </Link>
      </div>
    </h1>
  );
};

export default Header;
