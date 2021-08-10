import React from 'react';
import Vimeo from '@u-wave/react-vimeo';

function Projects(props) {
  return (
    <div className="container mx-auto flex items-center py-5">
      <div className="container mx-auto">
        <h2 className="text-2xl bg-black">HUDs</h2>
        <Vimeo
          video={340782519}
          width={1280}
          height={720}
          autoplay
          loop
          autopause="False"
          responsive="True"
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
        />
      </div>
    </div>
  );
}

export default Projects;
