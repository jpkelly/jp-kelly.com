import React from 'react';

function VimeoEmbed({
  video,
  controls = true,
  autoplay = false,
  loop = false,
  muted = false,
  background = false
}) {
  const params = new URLSearchParams({ autopause: 0 });
  if (autoplay) params.set('autoplay', 1);
  if (muted) params.set('muted', 1);
  if (loop) params.set('loop', 1);
  if (!controls) params.set('controls', 0);
  if (background) params.set('background', 1);

  return (
    <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
      <iframe
        src={`https://player.vimeo.com/video/${video}?${params}`}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        title={`Vimeo video ${video}`}
      />
    </div>
  );
}

export default VimeoEmbed;
