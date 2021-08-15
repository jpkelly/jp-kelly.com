import React from 'react';
import Vimeo from '@u-wave/react-vimeo';

function Nac2018(props) {
  return (
    <div className="container mx-auto flex items-center my-5 py-5">
      <div className="w-full grid grid-cols-1 grid-rows- gap-0">
        <div className="container mx-auto">
          <h2>NAC 2018 Opening Experience</h2>
          <Vimeo video={563887969} width={1280} height={720} responsive="True" autoplay="True" />
        </div>
        <div className=" h-5 pr-3 text-right text-xs">A Studio Firefly Production</div>
        <h2 className="">About This Project</h2>
        <div className="max-w-prose">
          <p>
            This was the opening experience for the 2018 BMW National Aftersales Conference.
            Attendees were given a QR code which allowed them to upload photos to be displayed on
            the screen during the opening video.
          </p>
          <p>
            I was responsible for developing all the on screen content and the web interface for
            attendees to upload photos. The tools I used were TouchDesigner, After Effects. I
            created a custom web interface for attendees to upload photos.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Nac2018;
