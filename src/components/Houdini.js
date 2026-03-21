import React from 'react';
import HoudiniContent from '../content/projects/houdini.mdx';

function Houdini(props) {
  return (
    <div className="container mx-auto flex items-center my-5 py-5">
      <div className="container mx-auto">
        <HoudiniContent />
      </div>
    </div>
  );
}

export default Houdini;
