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
        title="150 px"
        category=""
      />
      <Thumbnail
        link="https://via.placeholder.com/150"
        image="https://via.placeholder.com/150"
        title="150 px"
        category=""
      />
      <Thumbnail
        link="https://via.placeholder.com/150"
        image="https://via.placeholder.com/150"
        title="150 px"
        category=""
      />
    </div>
  );
}

export default Projects;
