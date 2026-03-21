import React from 'react';
import Vimeo from '@u-wave/react-vimeo';

function VimeoEmbed({ video, controls = true, autoplay = false, loop = false }) {
  return (
    <Vimeo
      className="z-0"
      video={video}
      width={1280}
      height={720}
      responsive="True"
      autopause="False"
      controls={controls ? 'True' : 'False'}
      autoplay={autoplay}
      loop={loop}
    />
  );
}

export default VimeoEmbed;
