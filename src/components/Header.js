import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
// import { BiHomeSmile } from 'react-icons/bi';
import kamon from '../kamon.png';

const Header = props => {
  let [toggleMenu, setToggleMenu] = useState(false);
  return (
    <h1 className="xl:text-2xl 2xl:text-4xl">
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
        {/* DROPDOWN MENU */}
        <div
          id="menu"
          className=" inline-block dropdown z-50"
          onMouseEnter={() => {
            setToggleMenu(true);
          }}
          onMouseLeave={() => {
            setToggleMenu(false);
          }}
        >
          <span className="px-3">Projects</span>
          {toggleMenu && (
            <ul className="z-50 dropdown-menu absolute rounded-b-lg text-gray-200 bg-black bg-opacity-80 py-3 ">
              <li
                className="py-3 text-2xl"
                onClick={() => {
                  setToggleMenu(!toggleMenu);
                }}
              >
                <Link className="link px-3" to="/F8interactive">
                  F8 Interactive
                </Link>
              </li>
              <li
                className="py-3 text-2xl"
                onClick={() => {
                  setToggleMenu(!toggleMenu);
                }}
              >
                <Link className="link px-3" to="/cranestory">
                  Crane Story
                </Link>
              </li>
              <li
                className="py-3 text-2xl"
                onClick={() => {
                  setToggleMenu(!toggleMenu);
                }}
              >
                <Link className="link px-3" to="/craneflock">
                  Flock of Cranes
                </Link>
              </li>
              <li
                className="py-3 text-2xl"
                onClick={() => {
                  setToggleMenu(!toggleMenu);
                }}
              >
                <Link className="link px-3" to="/PIWorks">
                  PIWorks 2019
                </Link>
              </li>
              <li
                className="py-3 text-2xl"
                onClick={() => {
                  setToggleMenu(!toggleMenu);
                }}
              >
                <Link className="link px-3" to="/huds">
                  Heads Up Displays
                </Link>
              </li>
              <li
                className="py-3 text-2xl"
                onClick={() => {
                  setToggleMenu(!toggleMenu);
                }}
              >
                <Link className="link px-3" to="/saturn">
                  Saturn Orbit
                </Link>
              </li>
              <li
                className="py-3 text-2xl"
                onClick={() => {
                  setToggleMenu(!toggleMenu);
                }}
              >
                <Link className="link px-3" to="/nac18">
                  NAC 2018 OEX
                </Link>
              </li>
              <li
                className="py-3 text-2xl"
                onClick={() => {
                  setToggleMenu(!toggleMenu);
                }}
              >
                <Link className="link px-3" to="/nac19">
                  NAC 2019 Banner
                </Link>
              </li>
              <li
                className="py-3 text-2xl"
                onClick={() => {
                  setToggleMenu(!toggleMenu);
                }}
              >
                <Link className="link px-3" to="/houdini">
                  Houdini Smoke
                </Link>
              </li>
              <li
                className="py-3 text-2xl"
                onClick={() => {
                  setToggleMenu(!toggleMenu);
                }}
              >
                <Link className="link px-3" to="/TOTO">
                  TOTO Hologram
                </Link>
              </li>
              <li
                className="py-3 text-2xl"
                onClick={() => {
                  setToggleMenu(!toggleMenu);
                }}
              >
                <Link className="link px-3" to="/manhole">
                  Manhole Cover
                </Link>
              </li>
              <li
                className="py-3 text-2xl"
                onClick={() => {
                  setToggleMenu(!toggleMenu);
                }}
              >
                <Link className="link px-3" to="/archive">
                  Archive
                </Link>
              </li>
            </ul>
          )}
        </div>
        {/* END DROPDOWN MENU https://codepen.io/huphtur/pen/ordMeN */}
      </div>
    </h1>
  );
};

export default Header;
