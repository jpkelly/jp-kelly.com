import React from 'react';
// import Vimeo from '@u-wave/react-vimeo';

function Encoder(props) {
  return (
    <div className="container mx-auto items-center my-5 py-5 ">
      <div className="w-full mx-auto">
        <h2>Encoder for Tracking Lens Data</h2>
        <p>
          Enclosure designed in Rhino 3D. Arduino and Raspberry Pi hardware for controller.
          Programming in Python to send encoder data to XR system via OSC.
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
        <div className="pb-7 my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
          <img
            className="object-cover h-full w-full"
            src="images/encoderDesign.png"
            alt="JP Kelly"
          />
          <p>CAD for enclosure in Rhino 3D</p>
        </div>
        <div className="pb-7 my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
          <img
            className="object-cover h-full w-full"
            src="images/encoderAssembly.png"
            alt="JP Kelly"
          />
          <p>Assembly of the 3D printed enclosure</p>
        </div>
        <div className="pb-7 my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
          <img className="object-cover h-full w-full" src="images/encoder2.png" alt="JP Kelly" />
          <p>Encoder mounted on camera</p>
        </div>
        <div className="pb-7 my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
          <img className="object-cover h-full w-full" src="images/encoder3.png" alt="JP Kelly" />
          <p>Encoder mounted on camera</p>
        </div>
        <div className="pb-7 my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
          <img className="object-cover h-full w-full" src="images/encoder1.png" alt="JP Kelly" />
          <p>Precision (1000 step) encoder</p>
        </div>
        <div className="pb-7 my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
          <img
            className="object-cover h-full w-full"
            src="images/encoderController.png"
            alt="JP Kelly"
          />
          <p>Encoder controller.</p>
        </div>
      </div>
    </div>
  );
}

export default Encoder;
