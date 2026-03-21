import React from 'react';
import SaturnContent from '../content/projects/saturn.mdx';

function Saturn(props) {
  return (
    <div className="container mx-auto flex items-center my-5 py-5">
      <div className="container mx-auto">
		<SaturnContent />
      </div>
    </div>
  );
}

export default Saturn;
