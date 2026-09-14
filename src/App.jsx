import { createContext, useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

import BackgroundFX from './components/BackgroundFX';
import GrandGates from './pages/GrandGates';
import RingPage from './pages/RingPage';
import MonogramPage from './pages/MonogramPage';
import MemoriesPage from './pages/MemoriesPage';
import VenuePage from './pages/VenuePage';
import RSVPPage from './pages/RSVPPage';
import { config } from './config';

import './App.css';

// Register GSAP plugins globally
gsap.registerPlugin(Draggable);

// Context for reduced motion preference
export const MotionContext = createContext({ prefersReducedMotion: false });

function App() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check system preference
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      gsap.globalTimeline.timeScale(100); // Effectively skip all animations
    } else {
      gsap.globalTimeline.timeScale(1);
    }
  }, [prefersReducedMotion]);

  const toggleReducedMotion = () => {
    setPrefersReducedMotion((prev) => !prev);
  };

  // --- Audio State ---
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const playAudio = useCallback(() => {
    if (!audioRef.current) return;
    
    // Start at 50% volume
    audioRef.current.volume = 0.5;
    
    audioRef.current.play().then(() => {
      setIsPlaying(true);
      setHasInteracted(true);
      
      // Fade to 100% volume over 1.25 seconds
      gsap.to(audioRef.current, { 
        volume: 1, 
        duration: 1.25, 
        ease: 'power1.inOut' 
      });
    }).catch(e => console.log('Autoplay blocked:', e));
  }, []);

  const pauseAudio = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const toggleAudio = useCallback(() => {
    if (isPlaying) pauseAudio();
    else playAudio();
  }, [isPlaying, playAudio, pauseAudio]);

  // Handle Tab Visibility (Pause when hidden, resume when visible)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isPlaying && audioRef.current) audioRef.current.pause();
      } else {
        if (isPlaying && audioRef.current) {
          audioRef.current.play().catch(e => console.log('Resume blocked:', e));
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isPlaying]);

  // Attempt autoplay on mount
  useEffect(() => {
    playAudio();
  }, [playAudio]);

  // --- Cinematic Gates State ---
  const [gatesOpened, setGatesOpened] = useState(false);
  const [gatesRemoved, setGatesRemoved] = useState(false);

  const handleGatesOpened = useCallback(() => {
    setGatesOpened(true);
  }, []);

  const handleGatesTransitionComplete = useCallback(() => {
    setGatesRemoved(true);
  }, []);

  return (
    <MotionContext.Provider value={{ prefersReducedMotion }}>
      <div className="da3wa-app" style={{ 
          overflowY: gatesOpened ? 'auto' : 'hidden', 
          height: gatesOpened ? 'auto' : '100dvh' 
        }}>
          {/* Global Interactive Background */}
          <BackgroundFX />

          {/* Global Background Audio */}
          <audio ref={audioRef} src={config.music.src} loop preload="auto" />

          {/* Cinematic Overlay: GrandGates */}
          {!gatesRemoved && (
            <div style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              pointerEvents: gatesOpened ? 'none' : 'auto',
            }}>
              <GrandGates 
                names={config.couple.monogramInitials || "A & L"} 
                onOpened={handleGatesOpened} 
                onTransitionComplete={handleGatesTransitionComplete}
                onInteractionStart={playAudio} // Play audio on first touch
              />
            </div>
          )}

          {/* Main App Content */}
          <div className="scroll-container">
            <RingPage />
            <MonogramPage />
            <MemoriesPage />
            <VenuePage />
            <RSVPPage />
          </div>
        </div>
    </MotionContext.Provider>
  );
}

export default App;
