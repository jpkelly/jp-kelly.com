import React from 'react';
import Vimeo from '@u-wave/react-vimeo';

function Projects(props) {
  return (
    <div className="container mx-auto flex items-center py-5">
      <div className="mx-auto">
        <h2 className="text-2xl bg-black">Heads Up Displays</h2>
        <Vimeo video={340782519} width={1280} height={720} autoplay loop autopause="False" />
        &nbsp;
        <Vimeo video={340248961} width={1280} height={720} autoplay loop autopause="False" />
      </div>
    </div>
  );
}

export default Projects;
