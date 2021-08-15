// from https://codepen.io/codetimeio/pen/RYMEJe

import React from 'react';

const Card = ({ title, text, imgsrc, link, alttext }) => {
  return (
    <div className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
      <a href={link}>
        <article className="group overflow-hidden border border-gray-500 rounded-lg">
          <a href={link}>
            <img alt={alttext} className="block h-auto w-full" src={imgsrc} />
          </a>

          <header className=" items-center justify-between leading-tight p-2 md:p-4">
            <h3 className="text-lg">
              <text className="no-underline ">{title}</text>
            </h3>
            <p className="text-sm">{text}</p>
          </header>
        </article>
      </a>
    </div>
  );
};

export default Card;
