import React from 'react';
import Vimeo from '@u-wave/react-vimeo';

function PIWorks(props) {
  return (
    <div className="container mx-auto flex items-center my-5 py-5 ">
      <div className="container mx-auto">
        <h2>3D City Animation</h2>
        <p>Animation for opening module of PIWorks 2019 Conference.</p>
        <Vimeo
          className="z-0"
          video={596850749}
          width={1280}
          height={720}
          autoplay
          autopause="False"
          responsive="True"
          controls="True"
        />
      </div>
    </div>
  );
}

export default PIWorks;
