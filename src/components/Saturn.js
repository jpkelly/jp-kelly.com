import React from 'react';
import Vimeo from '@u-wave/react-vimeo';

function Saturn(props) {
  return (
    <div className="container mx-auto flex items-center my-5 py-5">
      <div className="container mx-auto">
        <h2>Saturn Orbit Test</h2>
        <Vimeo video={587375676} width={1280} height={720} responsive="True" autoplay="True" />
      </div>
    </div>
  );
}

export default Saturn;
