import React from 'react';
import Vimeo from '@u-wave/react-vimeo';

function TOTO(props) {
  return (
    <div className="container mx-auto items-center my-5 py-5 ">
      <div className="w-full mx-auto">
        <h2>TOTO Hologram/Immersive Experience</h2>
        <Vimeo
          video={596273520}
          width={1280}
          height={720}
          autoplay
          loop="False"
          autopause="False"
          responsive="True"
          controls="True"
        />
      </div>
      <div className="flex flex-wrap my-5 lg:-mx-4">
        <div className=" my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
          <img className="object-cover h-full w-full" src="images/prototype.png" alt="JP Kelly" />
          <p>Prototype of hologram</p>
        </div>
        <div className=" my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
          <img className="object-cover h-full w-full" src="images/rpi.png" alt="JP Kelly" />
          <p>Custom printed circuit for controller</p>
        </div>
        <div className=" my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
          <img className="object-cover h-full w-full" src="images/shiz_box.png" alt="JP Kelly" />
          <p>3D printed model</p>
        </div>
      </div>
    </div>
  );
}

export default TOTO;
