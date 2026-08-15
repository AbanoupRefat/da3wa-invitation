import { useContext } from 'react';
import { AudioContext } from '../App';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
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
          {isPlaying ? <FiVolume2 size={24} /> : <FiVolumeX size={24} />}
        </div>
      </button>
    </>
  );
}
