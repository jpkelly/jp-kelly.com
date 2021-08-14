// from https://codepen.io/codetimeio/pen/RYMEJe

import React from 'react';

const Card = ({ title, text, imgsrc, link }) => {
  return (
    <div className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
      <article className="overflow-hidden border border-gray-500 rounded-lg">
        <a href={link}>
          <img alt="Placeholder" className="block h-auto w-full" src={imgsrc} />
        </a>

        <header className=" items-center justify-between leading-tight p-2 md:p-4">
          <h3 className="text-lg">
            <a className="no-underline hover:underline" href={link}>
              {title}
            </a>
          </h3>
          <p className=" text-sm">{text}</p>
        </header>
      </article>
    </div>
  );
};

export default Card;
