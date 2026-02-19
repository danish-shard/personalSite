import { useSound } from '../../context/SoundContext';

function SpeakerOnIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3z" />
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
      <path
        d="M19 12c0 3.04-1.73 5.68-4.28 7l1.16 2C18.83 19.28 21 15.82 21 12s-2.17-7.28-5.12-9l-1.16 2C17.27 6.32 19 8.96 19 12z"
        opacity="0.6"
      />
    </svg>
  );
}

function SpeakerMuteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63z" />
      <path d="M19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71z" />
      <path d="M4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  );
}

export default function MusicButton() {
  const { muted, toggleMute } = useSound();

  return (
    <button
      onClick={toggleMute}
      data-cursor="link"
      aria-label={muted ? 'Unmute space audio' : 'Mute space audio'}
      style={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        zIndex: 200,
        width: 52,
        height: 52,
        borderRadius: '50%',
        border: `1.5px solid ${muted ? 'rgba(255,80,80,0.40)' : 'rgba(0,200,255,0.35)'}`,
        background: 'rgba(4, 6, 20, 0.85)',
        backdropFilter: 'blur(14px)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease, color 0.3s ease',
        boxShadow: muted
          ? '0 0 14px rgba(255,80,80,0.18), inset 0 0 8px rgba(255,40,40,0.05)'
          : '0 0 20px rgba(0,200,255,0.22), inset 0 0 10px rgba(0,100,200,0.08)',
        color: muted ? 'rgba(255,80,80,0.85)' : 'rgba(0,200,255,0.90)',
        pointerEvents: 'auto',
      }}
    >
      {muted ? <SpeakerMuteIcon /> : <SpeakerOnIcon />}
    </button>
  );
}
