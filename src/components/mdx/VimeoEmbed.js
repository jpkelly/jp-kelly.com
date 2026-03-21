import React, { useState } from 'react';

function VimeoEmbed({
  video,
  controls = true,
  autoplay = false,
  loop = false,
  muted = false,
  background = false
}) {
  const [playing, setPlaying] = useState(autoplay);

  const params = new URLSearchParams({ autopause: 0 });
  if (playing) params.set('autoplay', 1);
  if (muted) params.set('muted', 1);
  if (loop) params.set('loop', 1);
  if (!controls) params.set('controls', 0);
  if (background) params.set('background', 1);

  return (
    <div style={{ padding: '56.25% 0 0 0', position: 'relative', background: '#111' }}>
      {!playing && (
        <button
          onClick={() => setPlaying(true)}
          aria-label="Play video"
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <span style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(23,107,135,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
          }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <polygon points="9,5 23,14 9,23" fill="white" />
            </svg>
          </span>
        </button>
      )}
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
