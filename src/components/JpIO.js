import React from 'react';
// import Vimeo from '@u-wave/react-vimeo';

function JpIO(props) {
  return (
    <div className="container mx-auto items-center my-5 py-5 ">
      <div className="w-full mx-auto">
        <h2>Raspberry Pi based analog/digital input/output to OSC interface.</h2>
        <p>
          This interface is designed to be reliable and flexible. Based on the Automation Hat, it
          can interface digital and analog inputs and outputs with OSC mesaging. The operating
          system runs in RAM off of a read only disk to minimize the possibility of disk corruption.
          It can run off of POE, has automatic cooling and an integrated display. Assembled with
          custom laser cut and 3D printed components.
        </p>
        {/* <Vimeo
          video={596273520}
          width={1280}
          height={720}
          autoplay
          loop="False"
          autopause="False"
          responsive="True"
          controls="True"
        /> */}
      </div>
      <div className="flex flex-wrap my-5 lg:-mx-4">
        <div className=" my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
          <img className="object-cover h-full w-full" src="images/jPioBox.png" alt="JP Kelly" />
          <p>jPio interface box.</p>
        </div>
        <div className=" my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
          <img className="object-cover h-full w-full" src="images/jPioTest.png" alt="JP Kelly" />
          <p>Testing interface built in TouchDesigner</p>
        </div>
        <div className=" my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
          <img className="object-cover h-full w-full" src="images/jPioBracket.png" alt="JP Kelly" />
          <p>3D printed display bracket</p>
        </div>
      </div>
    </div>
  );
}

export default JpIO;
