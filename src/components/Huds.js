import React from 'react';
import Vimeo from '@u-wave/react-vimeo';

function Huds(props) {
  return (
    <div className="container mx-auto flex items-center my-5 py-5 ">
      <div className="container mx-auto">
        <h2>Heads-up Displays</h2>
        <p>Futuristic data displays made with Notch.</p>
        <Vimeo
          className="z-0"
          video={340782519}
          width={1280}
          height={720}
          autoplay
          loop
          autopause="False"
          responsive="True"
          controls="False"
        />
        &nbsp;
        <Vimeo
          video={340248961}
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

export default Huds;
