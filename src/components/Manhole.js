import React from 'react';
import ManholeContent from '../content/projects/manhole.mdx';

function Manhole(props) {
  return (
    <div className="container mx-auto flex items-center my-5 py-5">
      <div className="container mx-auto">
        <ManholeContent />
      </div>
    </div>
  );
}

export default Manhole;
