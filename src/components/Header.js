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
        <Link className="px-3" to="/gallery">
          Gallery
        </Link>

        {/* MAKE COMPONENT */}
        <div id="menu" className=" inline-block dropdown z-50">
          <span className="px-3">Projects</span>
          <ul className="z-50 dropdown-menu absolute hidden rounded-b-lg text-gray-200 bg-black py-3 ">
            <li className="py-3">
              <Link className="link px-3" to="/nac2018">
                NAC 2018 OEX
              </Link>
            </li>
            <li className="py-3">
              <Link className="link px-3" to="/cranestory">
                Crane Story
              </Link>
            </li>
            <li className="py-3">
              <Link className="link px-3" to="/huds">
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
