import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function BackgroundFX() {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Ambient Orbs Animation ---
    const orbs = container.querySelectorAll('.bg-orb');
    orbs.forEach((orb, i) => {
      // Randomize movement for each orb
      gsap.to(orb, {
        x: "random(-100, 100)",
        y: "random(-100, 100)",
        rotation: "random(-45, 45)",
        duration: "random(10, 20)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * -2,
      });
      
      // Pulse opacity
      gsap.to(orb, {
        opacity: "random(0.3, 0.7)",
        duration: "random(5, 8)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * -1.5,
      });
    });

    // --- Fireflies (Particles) Animation ---
    const particles = container.querySelectorAll('.firefly');
    particles.forEach((p, i) => {
      // Initial random placement
      gsap.set(p, {
        x: `random(0, ${window.innerWidth})`,
        y: `random(0, ${window.innerHeight})`,
        opacity: `random(0, 0.8)`,
        scale: `random(0.5, 1.5)`,
      });

      // Float upwards slowly with sideways drift
      gsap.to(p, {
        y: "-=random(100, 300)",
        x: "+=random(-50, 50)",
        duration: "random(15, 30)",
        ease: "none",
        repeat: -1,
        modifiers: {
          y: gsap.utils.unitize(y => parseFloat(y) % window.innerHeight),
          x: gsap.utils.unitize(x => parseFloat(x) % window.innerWidth)
        }
      });

      // Twinkle opacity
      gsap.to(p, {
        opacity: "random(0.2, 1)",
        duration: "random(2, 6)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: "random(0, 5)"
      });
    });

  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: 'var(--bg-dark)', // Deep sage green base
        overflow: 'hidden',
      }}
    >
      {/* Ambient Orbs */}
      <div 
        className="bg-orb" 
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '70vw',
          height: '70vw',
          background: 'radial-gradient(circle, rgba(220,164,124,0.3) 0%, transparent 70%)',
          filter: 'blur(60px)',
          borderRadius: '50%',
        }}
      />
      <div 
        className="bg-orb" 
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '80vw',
          height: '80vw',
          background: 'radial-gradient(circle, rgba(255,211,182,0.2) 0%, transparent 70%)',
          filter: 'blur(80px)',
          borderRadius: '50%',
        }}
      />
      <div 
        className="bg-orb" 
        style={{
          position: 'absolute',
          top: '30%',
          left: '40%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(252,248,243,0.1) 0%, transparent 70%)',
          filter: 'blur(50px)',
          borderRadius: '50%',
        }}
      />

      {/* Fireflies */}
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="firefly"
          style={{
            position: 'absolute',
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: 'var(--gold-soft)', // from palette
            boxShadow: '0 0 8px 2px rgba(255, 211, 182, 0.4)',
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
