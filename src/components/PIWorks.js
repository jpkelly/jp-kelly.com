import React from 'react';
import PIWorksContent from '../content/projects/piworks.mdx';

function PIWorks(props) {
  return (
    <div className="container mx-auto flex items-center my-5 py-5">
      <div className="container mx-auto">
        <PIWorksContent />
      </div>
    </div>
  );
}

export default PIWorks;
