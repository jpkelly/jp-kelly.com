import React from 'react';
import jpk from '../jpk.jpg';

function About(props) {
  return (
    <div className="container mx-auto my-5 py-5">
      <h2>JP Kelly</h2>
      <div className="grid grid-cols-1 md:grid-cols-8 grid-rows-1 gap-10">
        <div className="col-span-8 md:col-span-8 lg:col-span-3">
          <img className="object-cover h-full w-full" src={jpk} alt="JP Kelly" />
        </div>
        <div className=" -mt-1.5 col-span-8 md:col-span-8 lg:col-span-5 max-w-prose">
          <p>
            I have always loved technology and science. As a kid my first major purchase was a
            computer with a 6502 processor and 4k of RAM (upgradeable to 8k). Although that computer
            was only capable of displaying graphics composed of ASCII characters, I dreamed of
            combining video imagery and computer graphics. Later I had access to an Amiga computer
            which I used to merge graphics with video.
          </p>
          <p>
            I have worked in the live events industry for many years as a video engineer and
            projectionist. I have a keen sense of what it takes to make imagery look great on
            screen. I found that I especially love to play video along with music as a VJ. Over the
            years I have had the opportunity to do live visuals for a number of musicians, events,
            and parties. I am constantly learning to use new software and equipment to create video
            art. I am a generalist by nature and am able to merge many disciplines. My background in
            electronics lends itself to the integration of sensors and other input devices to create
            interactive installations.
          </p>
          <p>
            While at California College of the Arts I learned how to uniquely express my views of
            social issues through art that engages the viewer. My goal and vision is to provide a
            way for people to grow and learn by touching their hearts.
          </p>
        </div>
      </div>
      <h2 className="mt-10 col-span-full">Here are a few of my favorie tools:</h2>
      <ul className="">
        <li>Photoshop, Illustrator, After Effects</li>
        <li>Rhino, Blender, Cinema 4D</li>
        <li>HTML, CSS, Javascript</li>
        <li>TouchDesigner</li>
        <li>VDMX</li>
        <li>Arduino, Raspberry Pi</li>
        <li>GitHub</li>
        <li>disguise (d3)</li>
        <li>Notch</li>
        <li>Python</li>
        <li>MaxMSP</li>
        <li>Ableton</li>
        <li>Unreal Engine</li>
        <li>Bash</li>
        <li>Graphic design & Typography</li>
        <li>Barco Eventmaster (E2)</li>
      </ul>
      <div className="col-span-full mt-12">
        <button
          className="bg-transparant w-full md:w-1/6 border border-blue-500 hover:bg-blue-900 text-white font-normal py-2 px-4 rounded"
          onClick={() => window.open('contactform', '_self')}
        >
          Contact
        </button>
      </div>
    </div>
  );
}

export default About;
