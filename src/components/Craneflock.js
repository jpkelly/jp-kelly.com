import React from 'react';
import CraneflockContent from '../content/projects/craneflock.mdx';

function Craneflock(props) {
  return (
    <div className="container mx-auto flex items-center my-5 py-5">
      <div className="container mx-auto">
        <CraneflockContent />
      </div>
    </div>
  );
}

export default Craneflock;
