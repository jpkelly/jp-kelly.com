import React from 'react';

function Articles(props) {
  return (
    <div className="container mx-auto flex items-center py-5 bg-green-900">
      <div className="float-left block mx-auto items-center bg-red-900">
        <h2 className="text-2xl bg-black">Articles</h2>
        <p className=" w-96  ">
          I remember being very young and wanting to become a part of the C.I.A. or F.B.I. with the
          intention of working my way up and somehow exposing them from the inside. I have no idea
          where this thought originated, perhaps my mother. I always loved technology. As a kid my
          first major purchase was a computer. It had a 6502 processor and 4k of RAM. (upgradeable
          to 8k). I had visions of combining video imagery and computer graphics. Many years later I
          actually found the means to merge graphics with video. While studying graphic design at
          California College of the Arts I discovered agitprop, which appealed to my subversive
          nature. This, combined with the focus on technology of the C.C.A. Media Arts department, I
          found a direction for my art practice I could be passionate about.
        </p>
      </div>
      <div className="w-96 border border-yellow-300">
        <button
          class="bg-transparant border border-blue-500 hover:bg-blue-900 text-white font-normal py-2 px-4 rounded"
          onClick={() => alert('hello, world')}
        >
          Button
        </button>
      </div>
    </div>
  );
}

export default Articles;
