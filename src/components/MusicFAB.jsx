import { useContext } from 'react';
import { AudioContext } from '../App';
import './MusicFAB.css';

export default function MusicFAB() {
  const { isPlaying, hasInteracted, toggleAudio } = useContext(AudioContext);

  return (
    <>
      <button
        className={`music-fab ${isPlaying ? 'is-playing' : ''} ${!hasInteracted ? 'pulse-hint' : ''}`}
        onClick={toggleAudio}
        aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
        title={isPlaying ? 'Pause Music' : 'Play Music'}
        id="music-toggle"
      >
        <div className="music-fab__icon">
          {isPlaying ? (
            <div className="equalizer">
              <span className="bar bar-1"></span>
              <span className="bar bar-2"></span>
              <span className="bar bar-3"></span>
              <span className="bar bar-4"></span>
            </div>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          )}
        </div>
      </button>
    </>
  );
}
