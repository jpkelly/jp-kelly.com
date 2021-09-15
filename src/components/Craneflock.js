import React from 'react';
import Vimeo from '@u-wave/react-vimeo';

function Craneflock(props) {
  return (
    <div className="container mx-auto flex items-center my-5 py-5">
      <div className="container mx-auto">
        <h2>Flock of Cranes</h2>
        <p>Testing out the flocking node in Notch. Cloning 3D objects with randomized textures.</p>
        <Vimeo
          video={587373143}
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

export default Craneflock;
