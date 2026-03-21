import React from 'react';
import CranestoryContent from '../content/projects/cranestory.mdx';

function Cranestory(props) {
  return (
    <div className="container mx-auto flex items-center my-5 py-5">
      <div className="container mx-auto">
        <CranestoryContent />
      </div>
    </div>
  );
}

export default Cranestory;
