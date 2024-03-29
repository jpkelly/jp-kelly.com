import React from 'react';
import Vimeo from '@u-wave/react-vimeo';

function Cranestory(props) {
  return (
    <div className="container mx-auto flex items-center my-5 py-5">
      <div className="container mx-auto">
        <h2>鶴の恩返し (The Crane's Requital)</h2>
        <p>
          Made with Notch. Inspired by a story of a man who rescues a crane one cold winter night.
        </p>
        <Vimeo
          video={489306679}
          width={1280}
          height={720}
          responsive="True"
          autoplay="True"
          autopause="False"
        />
      </div>
    </div>
  );
}

export default Cranestory;
