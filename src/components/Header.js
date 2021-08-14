import React from 'react';
import { Link } from 'react-router-dom';
// import { BiHomeSmile } from 'react-icons/bi';
import kamon from '../kamon.png';

const Header = props => {
  return (
    <h1 className="xl:text-3xl 2xl:text-4xl">
      <Link to="/about">
        <img src={kamon} className="kamon" alt="logo" />
      </Link>
      <div className="inline-block divide-x-2 mt-2.5 xl:mt-1 2xl:mt-3">
        <Link className="px-3" to="/about">
          About
        </Link>
        <Link className="px-3" to="/projects">
          Gallery
        </Link>

        {/* MAKE COMPONENT */}
        <div class=" inline-block dropdown z-50">
          <span class="px-3">Projects</span>
          <ul class="z-50 dropdown-menu absolute hidden rounded-b text-gray-200 bg-gray-900 pt-1">
            <li class="">
              <Link className="px-3" to="/nac2018">
                NAC'18 OEX
              </Link>
            </li>
            <li class="">
              <Link className="px-3" to="/cranestory">
                Crane Story
              </Link>
            </li>
            <li class="">
              <Link className="px-3" to="/projects">
                HUDs
              </Link>
            </li>
          </ul>
        </div>
        {/* END MAKE COMPONENT https://codepen.io/huphtur/pen/ordMeN */}
      </div>
    </h1>
  );
};

export default Header;
