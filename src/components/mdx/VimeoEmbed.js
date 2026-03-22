import React, { useState } from 'react';

function VimeoEmbed({
  video,
  controls = true,
  autoplay = false,
  loop,
  muted = false,
  background = false,
  portrait = false
}) {
  const autoplayEnabled = autoplay || background;
  const loopEnabled = typeof loop === 'boolean' ? loop : autoplayEnabled;
  const backgroundEnabled = background || (autoplayEnabled && loopEnabled);
  const mutedEnabled = muted || autoplayEnabled;
  const controlsEnabled = autoplayEnabled ? false : controls;

  const [playing, setPlaying] = useState(autoplayEnabled);

  const params = new URLSearchParams({ autopause: 0 });
  if (playing) params.set('autoplay', 1);
  if (mutedEnabled) params.set('muted', 1);
  if (loopEnabled) params.set('loop', 1);
  if (!controlsEnabled) params.set('controls', 0);
  if (backgroundEnabled) params.set('background', 1);

  const paddingTop = portrait ? '177.78%' : '56.25%';

  return (
    <div style={{ padding: `${paddingTop} 0 0 0`, position: 'relative', background: '#111' }}>
      {!autoplayEnabled && !playing && (
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
            background: 'rgba(30,58,138,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
          }}>
            <span
              aria-hidden="true"
              style={{
                width: 0,
                height: 0,
                borderTop: '10px solid transparent',
                borderBottom: '10px solid transparent',
                borderLeft: '16px solid white',
                marginLeft: 3,
              }}
            />
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
