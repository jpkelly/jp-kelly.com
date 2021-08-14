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
          Projects
        </Link>
        <Link className="px-3" to="/cranestory">
          Crane Story
        </Link>
        <Link className="px-3" to="/nac2018">
          NAC'18 OEX
        </Link>

        {/* MAKE COMPONENT */}
        <div class="p-10">
          <div class="dropdown inline-block relative z-50">
            <button class="bg-black text-gray-200 font-normal py-2 px-4 rounded inline-flex items-center">
              <span class="mr-1">Dropdown</span>
              {/* <svg
                class="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />{' '}
              </svg> */}
            </button>
            <ul class="dropdown-menu absolute hidden rounded-b text-gray-200 bg-gray-900 pt-1">
              <li class="">
                <a class="rounded-t 0 py-2 px-4 block whitespace-no-wrap" href="#">
                  One
                </a>
              </li>
              <li class="">
                <a class=" py-2 px-4 block whitespace-no-wrap" href="#">
                  Two
                </a>
              </li>
              <li class="">
                <a class=" py-2 px-4 block whitespace-no-wrap" href="#">
                  Three is the magic number
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* END MAKE COMPONENT https://codepen.io/huphtur/pen/ordMeN */}
      </div>
    </h1>
  );
};

export default Header;
