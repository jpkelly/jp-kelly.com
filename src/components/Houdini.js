import React from 'react';
import Vimeo from '@u-wave/react-vimeo';

function Houdini(props) {
  return (
    <div className="container mx-auto flex items-center my-5 py-5 ">
      <div className="container mx-auto">
        <h2>Houdini Smoke</h2>
        <p>Previsualization of smoke effect for MINI car show created in Houdini.</p>
        <Vimeo
          className="z-0"
          video={595085863}
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

export default Houdini;
