import React from 'react';
import Card from './Card';

function Gallery(props) {
  return (
    <div className="container mx-auto my-5 py-5 ">
      <h2>Here are a few of my projects.</h2>
      {/* wrapper */}
      <div className="container w-full mx-auto ">
        {/* <div className="flex flex-wrap -mx-1 lg:-mx-4"> */}
        <div className="md:masonry-2-col lg:masonry-3-col box-border mx-auto before:box-inherit after:box-inherit">
          <Card
            title="GPIO / OSC interface"
            text="Raspberry Pi based device for interfacing analog/digital, input/output to OSC Messaging. Includes POE, and integrated display."
            imgsrc={[
              { src: 'thumbnails/jPioBox.png', alt: 'GPIO/OSC interfate' },
              { src: 'thumbnails/jPioTest.png', alt: 'Tester for GPIO/OSC interface' },
              { src: 'thumbnails/jPioBracket.png', alt: 'Tester for GPIO/OSC interface' }
            ]}
            link="/jpio"
          />
          <Card
            title="Encoder for Tracking Lens Data"
            text="3D printed enclosure and programming controller for sending lens data via OSC."
            imgsrc={[
              { src: 'thumbnails/encoder1.png', alt: 'Enclosure CAD Drawing' },
              { src: 'thumbnails/encoder2.png', alt: 'Enclosure Assembly' },
              { src: 'thumbnails/encoder3.png', alt: 'Installed on Camera' }
            ]}
            link="/encoder"
          />
          <Card
            title="F8 Developers Interactive Installation"
            text="Attendees manipulate visuals in real time. Notch, TouchDesigner, LEAP Motion and StreamDeck controller."
            imgsrc={[
              { src: 'thumbnails/F8interactive.png', alt: 'F8 Interactive Installation' },
              { src: 'thumbnails/F8interactive2.png', alt: 'F8 Interactive Installation User' }
            ]}
            link="/F8interactive"
          />
          <Card
            title="鶴の恩返し (The Crane's Requital)"
            text="Made with Notch. Inspired by a story of a man who rescues a crane one cold winter night."
            imgsrc={[
              { src: 'thumbnails/CraneB+W.png', alt: 'Crane in Black and White' },
              { src: 'thumbnails/cranestory.png', alt: 'The Crane&#39;s Requital' }
            ]}
            link="/cranestory"
          />
          <Card
            title="Flock of Paper Cranes"
            text="Testing out the flocking node in Notch. Cloning 3D objects with randomized textures."
            imgsrc={[
              { src: 'thumbnails/craneFlockWide.png', alt: 'Flock of paper cranes' },
              { src: 'thumbnails/craneflock.png', alt: 'Flock of paper cranes' }
            ]}
            link="/craneflock"
          />
          <Card
            title="PIWorks 2019 Opening Animation"
            text="Animation for opening of PIWorks 2019 conference. Created with Cinema4D."
            imgsrc={[
              { src: 'thumbnails/PiWorksWireframe.png', alt: 'PIWorks Wireframe' },
              { src: 'thumbnails/PIWorks.png', alt: 'PIWorks Opening' }
            ]}
            link="/PIWorks"
          />
          <Card
            title="Heads Up Displays"
            text="Futuristic data displays made with Notch."
            imgsrc={[
              { src: 'thumbnails/hud1.png', alt: 'Heads Up Displays' },
              { src: 'thumbnails/hud2.png', alt: 'Heads Up Displays' },
              { src: 'thumbnails/hud3.png', alt: 'Heads Up Displays' }
            ]}
            link="/huds"
          />
          <Card
            title="Saturn Orbit Test"
            text="On screen visuals for an interactive game at a live event. Created with Notch."
            imgsrc={[{ src: 'thumbnails/saturn.png', alt: 'Saturn Notch' }]}
            link="/saturn"
          />
          <Card
            title="NAC 2018 Opening Experience"
            text="2018 BMW National Aftersales Conference opening. Attendees use QR code to upload photos which are shown screen."
            imgsrc={[
              { src: 'thumbnails/nac18.png', alt: 'NAC 2018 opening experience' },
              { src: 'thumbnails/NAClook.png', alt: 'NAC 2018 opening experience' }
            ]}
            link="/nac18"
          />
          <Card
            title="NAC 2019 Digital Ribbon"
            text="Screen look for BMW National Aftersales Conference. Created with Notch, Aftereffects, and disguise (d3)."
            imgsrc={[
              { src: 'thumbnails/NACribbon.png', alt: 'NAC 2019 Digital Ribbon' },
              { src: 'thumbnails/nac19.png', alt: 'NAC 2019 Screen Look' }
            ]}
            link="/nac19"
          />
          <Card
            title="Houdini Previz"
            text="Previsualization of smoke effect for a MINI show created in Houdini."
            imgsrc={[
              { src: 'thumbnails/Houdini.png', alt: 'Houdini Smoke' },
              { src: 'thumbnails/miniPreViz.png', alt: 'Houdini Smoke' }
            ]}
            link="/houdini"
          />
          <Card
            title="TOTO Hologram"
            text="This is a hologram (Pepper's Ghost) of an animated character for TOTO's San Francisco showroom."
            imgsrc={[
              { src: 'thumbnails/TOTO.png', alt: 'TOTO Hologram' },
              { src: 'thumbnails/prototype.png', alt: 'Hologram Prototype' },
              { src: 'thumbnails/rpi.png', alt: 'Custom PCB' }
            ]}
            link="/TOTO"
          />
          <Card
            title="Manhole Cover in Rain"
            text="Playing around with substances in Notch."
            imgsrc={[{ src: 'thumbnails/manhole.png', alt: 'manhole cover' }]}
            link="/manhole"
          />
          {/* <Card title="title" text="text" imgsrc="thumbnails/huds.png" link="/huds" alttext="" /> */}
        </div>
      </div>
    </div>
  );
}

export default Gallery;
