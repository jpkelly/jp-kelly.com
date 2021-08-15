import React from 'react';
import Card from './Card';

function Gallery(props) {
  return (
    <div className="container mx-auto my-5 py-5 ">
      <h2>Project Gallery</h2>
      {/* wrapper */}
      <div className="container w-full mx-auto px-4 md:px-12">
        <div className="flex flex-wrap -mx-1 lg:-mx-4">
          <Card
            title="鶴の恩返し (The Crane's Requital)"
            text="Made with Notch. Inspired by a story of a man who rescues a crane one cold winter night."
            imgsrc="thumbnails/cranestory.png"
            link="/cranestory"
            alttext="The Crane's Requital"
          />
          <Card
            title="Flock of Cranes"
            text="Testing out the flocking node in Notch."
            imgsrc="thumbnails/craneflock.png"
            link="/craneflock"
            alttext="Flock of paper cranes"
          />
          <Card
            title="NAC 2018 Opening Experience"
            text="Opening video for the 2018 BMW National Aftersales Conference. Attendees were given a QR code which allowed them to upload photos to be displayed on the screen during the opening video."
            imgsrc="thumbnails/nac18.png"
            link="/nac2018"
            alttext="NAC 2018 opening experience"
          />
          <Card
            title="Heads Up Displays"
            text="Futuristic data displays made with Notch. "
            imgsrc="thumbnails/huds.png"
            link="/huds"
            alttext="Heads Up Displays"
          />
          <Card
            title="Saturn Orbit Test"
            text="On screen visuals for an interactive game at a live event. Created with Notch."
            imgsrc="thumbnails/saturn.png"
            link="/saturn"
            alttext="Saturn"
          />
          <Card title="title" text="text" imgsrc="thumbnails/huds.png" link="/huds" alttext="" />
          <Card title="title" text="text" imgsrc="thumbnails/huds.png" link="/huds" alttext="" />
          <Card title="title" text="text" imgsrc="thumbnails/huds.png" link="/huds" alttext="" />
          <Card title="title" text="text" imgsrc="thumbnails/huds.png" link="/huds" alttext="" />
          <Card title="title" text="text" imgsrc="thumbnails/huds.png" link="/huds" alttext="" />
          <Card title="title" text="text" imgsrc="thumbnails/huds.png" link="/huds" alttext="" />
          <Card title="title" text="text" imgsrc="thumbnails/huds.png" link="/huds" alttext="" />
          <Card title="title" text="text" imgsrc="thumbnails/huds.png" link="/huds" alttext="" />
          <Card title="title" text="text" imgsrc="thumbnails/huds.png" link="/huds" alttext="" />
        </div>
      </div>
    </div>
  );
}

export default Gallery;
