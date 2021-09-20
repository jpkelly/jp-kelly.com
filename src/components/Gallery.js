import React from 'react';
import Card from './Card';

function Gallery(props) {
  return (
    <div className="container mx-auto my-5 py-5 ">
      <h2>Project Gallery</h2>
      {/* wrapper */}
      <div className="container w-full mx-auto ">
        <div className="flex flex-wrap -mx-1 lg:-mx-4">
          <Card
            title="F8 Developers Interactive Installation"
            text="Attendees manipulate visuals in real time. Notch, TouchDesigner, LEAP Motion and StreamDeck controller."
            imgsrc="thumbnails/F8interactive.png"
            link="/F8interactive"
            alttext="F8 Interactive Installation"
          />
          <Card
            title="鶴の恩返し (The Crane's Requital)"
            text="Made with Notch. Inspired by a story of a man who rescues a crane one cold winter night."
            imgsrc="thumbnails/cranestory.png"
            link="/cranestory"
            alttext="The Crane's Requital"
          />
          <Card
            title="Flock of Cranes"
            text="Testing out the flocking node in Notch. Cloning 3D objects with randomized textures."
            imgsrc="thumbnails/craneflock.png"
            link="/craneflock"
            alttext="Flock of paper cranes"
          />
          <Card
            title="PIWorks 2019 Opening Animation"
            text="Animation for opening of PIWorks 2019 conference. Created with Cinema4D."
            imgsrc="thumbnails/PIWorks.png"
            link="/PIWorks"
            alttext=""
          />
          <Card
            title="Heads Up Displays"
            text="Futuristic data displays made with Notch."
            imgsrc="thumbnails/huds.png"
            link="/huds"
            alttext="Heads Up Displays"
          />
          <Card
            title="Saturn Orbit Test"
            text="On screen visuals for an interactive game at a live event. Created with Notch."
            imgsrc="thumbnails/saturn.png"
            link="/saturn"
            alttext="Saturn Notch"
          />
          <Card
            title="NAC 2018 Opening Experience"
            text="2018 BMW National Aftersales Conference opening. Attendees use QR code to upload photos which are shown screen."
            imgsrc="thumbnails/nac18.png"
            link="/nac18"
            alttext="NAC 2018 opening experience"
          />
          <Card
            title="NAC 2019 Digital Ribbon"
            text="Screen look for BMW National Aftersales Conference. Created with Notch, Aftereffects, and disguise (d3)."
            imgsrc="thumbnails/nac19.png"
            link="/nac19"
            alttext="NAC 2019 Screen Look"
          />
          <Card
            title="Houdini Previz"
            text="Previsualization of smoke effect for a MINI show created in Houdini."
            imgsrc="thumbnails/Houdini.png"
            link="/houdini"
            alttext="Houdini Smoke"
          />
          <Card
            title="TOTO Hologram"
            text="This is a hologram (Pepper's Ghost) of an animated character for TOTO's San Francisco showroom."
            imgsrc="thumbnails/TOTO.png"
            link="/TOTO"
            alttext="TOTO Hologram"
          />
          <Card
            title="Manhole Cover in Rain"
            text="Playing around with substances in Notch."
            imgsrc="thumbnails/manhole.png"
            link="/manhole"
            alttext="manhole cover"
          />
          {/* <Card title="title" text="text" imgsrc="thumbnails/huds.png" link="/huds" alttext="" /> */}
        </div>
      </div>
    </div>
  );
}

export default Gallery;
