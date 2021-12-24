// from https://codepen.io/codetimeio/pen/RYMEJe

import React from 'react';
import ImageList from './ImageList';

const Card = ({ title, text, imgsrc, link }) => {
  return (
    <div className="break-inside">
      <div className="pb-8">
        <a href={link}>
          <article className="group overflow-hidden border border-gray-300 rounded-lg">
            <header className=" items-center justify-between leading-tight p-2 md:p-4">
              <h3 className="text-lg">
                <text className="no-underline ">{title}</text>
              </h3>
              <p className="text-sm">{text}</p>
            </header>
            <ImageList photo={imgsrc} />
          </article>
        </a>
      </div>
    </div>
  );
};

export default Card;
