import React from 'react';
import Thumbnail from './Thumbnail.js';
import './App.css';

function Projects(props) {
  return (
    <div>
      <h1>Projects</h1>
      <Thumbnail
        link="https://via.placeholder.com/150"
        image="https://via.placeholder.com/150"
        title="150 pc"
        category="Interactive"
      />
      <Thumbnail
        link="https://via.placeholder.com/250"
        image="https://via.placeholder.com/250"
        title="250 px"
        category="UI"
      />
      <Thumbnail
        link="https://via.placeholder.com/350"
        image="https://via.placeholder.com/350"
        title="350 px"
        category="Code"
      />
    </div>
  );
}

export default Projects;
