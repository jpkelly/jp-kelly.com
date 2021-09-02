import React from 'react';
import Vimeo from '@u-wave/react-vimeo';

function F8interactive(props) {
  return (
    <div className="container w-full mx-auto my-5 py-5">
      <h2>Interactive Installation at F8</h2>
      <p>
        Installed for a party at Facebook F8 Developers conference. Notch, disguise, TouchDesigner,
        LEAP Motion, and StreamDeck were used. The user could select different effects with the
        StreamDeck and manipulate them with the LEAP Motion.
      </p>

      <div className="flex flex-wrap w-full mx-auto 2xl:pr-56">
        <div className="my-1 w-full md:w-full lg:my-4 lg:w-1/2 lg:pr-5 xl:pr-10">
          <Vimeo
            video={594474578}
            width={720}
            height={1280}
            responsive="True"
            autoplay="True"
            autopause="False"
            loop="True"
            muted="True"
          />
        </div>
        <div className="my-1 w-full md:w-full lg:my-4 lg:w-1/2 lg:pl-5 xl:pl-10">
          <Vimeo
            video={594474463}
            width={720}
            height={1280}
            responsive="True"
            autoplay="True"
            autopause="False"
            loop="True"
          />
        </div>
      </div>
    </div>
  );
}

export default F8interactive;
