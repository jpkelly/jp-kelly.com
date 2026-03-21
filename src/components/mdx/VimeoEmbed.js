import React from 'react';
import Vimeo from '@u-wave/react-vimeo';

function VimeoEmbed({
  video,
  controls = true,
  autoplay = false,
  loop = false,
  muted = false,
  background = false
}) {
  return (
    <Vimeo
      className="z-0"
      video={video}
      width={1280}
      height={720}
      responsive
      autopause={false}
      controls={controls}
      autoplay={autoplay}
      loop={loop}
      muted={muted}
      background={background}
    />
  );
}

export default VimeoEmbed;
