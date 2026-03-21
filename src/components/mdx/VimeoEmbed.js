import React, { useEffect, useRef, useState } from 'react';

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
  const holdLastFrame = autoplayEnabled && !loopEnabled;

  const [playing, setPlaying] = useState(autoplayEnabled);
  const iframeRef = useRef(null);
  const lastTimeRef = useRef(0);
  const holdAppliedRef = useRef(false);

  const params = new URLSearchParams({ autopause: 0 });
  if (playing) params.set('autoplay', 1);
  if (mutedEnabled) params.set('muted', 1);
  if (loopEnabled) params.set('loop', 1);
  if (!controlsEnabled) params.set('controls', 0);
  if (backgroundEnabled) params.set('background', 1);

  const paddingTop = portrait ? '177.78%' : '56.25%';

  useEffect(() => {
    if (!holdLastFrame || !playing) {
      return undefined;
    }

    const iframe = iframeRef.current;
    if (!iframe) {
      return undefined;
    }

    const postToPlayer = (method, value) => {
      const message = typeof value === 'undefined' ? { method } : { method, value };
      iframe.contentWindow?.postMessage(JSON.stringify(message), '*');
    };

    const onMessage = (event) => {
      if (event.origin !== 'https://player.vimeo.com') {
        return;
      }

      if (event.source !== iframe.contentWindow) {
        return;
      }

      let data = event.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }

      if (!data || typeof data !== 'object') {
        return;
      }

      if (data.event === 'ready') {
        postToPlayer('addEventListener', 'timeupdate');
        return;
      }

      if (data.event === 'timeupdate' && data.data && typeof data.data.seconds === 'number') {
        const seconds = data.data.seconds;
        const duration = typeof data.data.duration === 'number' ? data.data.duration : null;
        lastTimeRef.current = seconds;

        if (!holdAppliedRef.current && duration && duration > 0) {
          const remaining = duration - seconds;
          // Pause just before the player enters the ended/replay state.
          if (remaining <= 0.12) {
            holdAppliedRef.current = true;
            postToPlayer('pause');
            postToPlayer('setCurrentTime', Math.max(seconds, 0));
          }
        }
        return;
      }
    };

    holdAppliedRef.current = false;
    window.addEventListener('message', onMessage);
    postToPlayer('addEventListener', 'ready');
    postToPlayer('addEventListener', 'timeupdate');

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, [holdLastFrame, playing, video]);

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
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <polygon points="9,5 23,14 9,23" fill="white" />
            </svg>
          </span>
        </button>
      )}
      <iframe
        ref={iframeRef}
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
