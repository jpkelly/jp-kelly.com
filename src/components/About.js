import React from 'react';
import Vimeo from '@u-wave/react-vimeo';

function About(props) {
  return (
    <div className="container mx-auto flex items-center my-5 py-5">
      <div className="container mx-auto">
        <h2>鶴の恩返し (The Crane's Requital)</h2>
        <Vimeo video={489306679} width={1280} height={720} responsive="True" />
      </div>
    </div>
  );
}

export default About;
