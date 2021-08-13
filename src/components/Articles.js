import React from 'react';
import jpk from '../jpk.jpg';

function Articles(props) {
  return (
    <div className="container mx-auto my-5 py-5">
      <h2>JP Kelly</h2>
      <div className="grid grid-cols-1 md:grid-cols-8 grid-rows-3 gap-5">
        <div className="col-span-8 md:col-span-8 lg:col-span-3">
          <img className="object-cover h-full w-full" src={jpk} alt="JP Kelly" />
        </div>
        <div className="col-span-8 md:col-span-8 lg:col-span-5 max-w-prose">
          <p className="text-base xl:text-lg">
            I have always loved technology and science. As a kid my first major purchase was a
            computer with a 6502 processor and 4k of RAM. (upgradeable to 8k). I had visions of
            combining video imagery and computer graphics. That computer was only capable of
            displaying graphics composed of ASCII characters. Later I had access to an Amiga
            computer which I used to merge graphics with video. I have worked in the live events
            industry for many years as a video engineer and projectionist. I have a keen sense of
            what it takes to make imagery look great on screen. Over the years I have constantly
            learned to use new software and equipment to create art. I found that I especially love
            to play along with music as a VJ.
          </p>
        </div>

        <div className="col-span-full items-center border border-yellow-300">
          <button
            class="bg-transparant border border-blue-500 hover:bg-blue-900 text-white font-normal py-2 px-4 rounded"
            onClick={() => alert('hello, world')}
          >
            Button
          </button>
        </div>
      </div>
    </div>
  );
}

export default Articles;
