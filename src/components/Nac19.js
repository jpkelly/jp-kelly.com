import React from 'react';
import Vimeo from '@u-wave/react-vimeo';
import jpk from '../nac19.jpg';

function Nac19(props) {
  return (
    <div className="container mx-auto flex items-center my-5 py-5 ">
      <div className="container mx-auto">
        <h2>NAC 2019 Digital Ribbon</h2>
        <p>
          Motion graphics for screens at BMW 2019 National Aftersales Conference. Made with Notch,
          After Effects, and disguise (d3).
        </p>
        <div className="">
          <Vimeo
            className="z-0"
            video={595563770}
            width={1280}
            height={720}
            autoplay
            loop
            autopause="False"
            responsive="True"
            controls="False"
          />
        </div>
        <div className="col-span-8 md:col-span-8 lg:col-span-3">
          <img className="object-cover h-full w-full" src={jpk} alt="JP Kelly" />
        </div>
      </div>
    </div>
  );
}

export default Nac19;
