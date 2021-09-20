import React from 'react';
import Vimeo from '@u-wave/react-vimeo';

function Manhole(props) {
  return (
    <div className="container mx-auto flex items-center my-5 py-5 ">
      <div className="container mx-auto">
        <h2>Manhole Cover in Rain</h2>
        <p>Playing with substances in Notch.</p>
        <Vimeo
          className="z-0"
          video={609547675}
          width={1280}
          height={720}
          autoplay
          loop
          autopause="False"
          responsive="True"
          controls="False"
        />
      </div>
    </div>
  );
}

export default Manhole;
