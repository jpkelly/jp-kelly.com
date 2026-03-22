import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
// import { BiHomeSmile } from 'react-icons/bi';
import kamon from '../kamon.png';
import projects from '../content/projects.json';

const Header = props => {
  let [toggleMenu, setToggleMenu] = useState(false);
  return (
    <h1 className="relative z-20 flex items-center xl:text-2xl 2xl:text-4xl" style={{ transform: 'translateY(15px)' }}>
      <Link to="/about" className="logo-anchor">
        <img src={kamon} className="kamon" alt="logo" />
      </Link>
      <div className="inline-flex items-center divide-x-2 ml-1 xl:ml-2">
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
              {projects.map(project => (
                <li
                  key={project.id}
                  className="py-3 text-2xl"
                  onClick={() => {
                    setToggleMenu(!toggleMenu);
                  }}
                >
                  <Link className="link px-3" to={project.path}>
                    {project.menuLabel}
                  </Link>
                </li>
              ))}
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
        <Link className="px-3" to="/about">
          About
        </Link>
      </div>
    </h1>
  );
};

export default Header;
