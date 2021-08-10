import React from 'react';
import Vimeo from '@u-wave/react-vimeo';

function About(props) {
  return (
    <div className="container mx-auto flex items-center py-5">
      <div className="mx-auto">
        <h2 className="text-2xl bg-black">鶴の恩返し (The Crane's Gift)</h2>
        <Vimeo video={489306679} width={1280} height={720} />
      </div>
    </div>
  );
}

export default About;
