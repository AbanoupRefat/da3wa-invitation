import { useRef, useState, useEffect, useCallback } from 'react';
import { config } from '../config';
import './RingPage.css';

export default function RingPage() {
  const stageRef = useRef(null);
  const groomRef = useRef(null);
  const brideWrapRef = useRef(null);
  const brideRingRef = useRef(null);
  const canvasRef = useRef(null);
  const hintRef = useRef(null);
  const celebrationRef = useRef(null);

  const [locked, setLocked] = useState(false);

  // Physics refs (no re-renders)
  const dragging = useRef(false);
  const pos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const lastPointer = useRef({ x: 0, y: 0, t: 0 });
  const startPointer = useRef({ x: 0, y: 0 });
  const magnetActive = useRef(false);
  const lockedRef = useRef(false);
  const rafMomentum = useRef(null);
  const actxRef = useRef(null);

  // ─── Synthesized Audio ───
  const getAudioCtx = useCallback(() => {
    if (!actxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      actxRef.current = new AC();
    }
    return actxRef.current;
  }, []);

  const playSound = useCallback((kind) => {
    try {
      const c = getAudioCtx();
      if (c.state === 'suspended') c.resume();
      const now = c.currentTime;

      if (kind === 'pickup') {
        const o = c.createOscillator(), g = c.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(680, now);
        o.frequency.exponentialRampToValueAtTime(920, now + 0.05);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.06, now + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
        o.connect(g); g.connect(c.destination);
        o.start(now); o.stop(now + 0.1);
      } else if (kind === 'tick') {
        const o = c.createOscillator(), g = c.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(1400, now);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.035, now + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        o.connect(g); g.connect(c.destination);
        o.start(now); o.stop(now + 0.05);
      } else if (kind === 'lock') {
        const noiseBuf = c.createBuffer(1, c.sampleRate * 0.06, c.sampleRate);
        const data = noiseBuf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
        }
        const noise = c.createBufferSource(); noise.buffer = noiseBuf;
        const nf = c.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 2200; nf.Q.value = 1.1;
        const ng = c.createGain(); ng.gain.setValueAtTime(0.16, now);
        ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
        noise.connect(nf); nf.connect(ng); ng.connect(c.destination);
        noise.start(now);
        [1760, 2350, 3130].forEach((freq, idx) => {
          const so = c.createOscillator(), sg = c.createGain();
          so.type = 'sine'; so.frequency.value = freq;
          const t0 = now + 0.02 + idx * 0.03;
          sg.gain.setValueAtTime(0.0001, t0);
          sg.gain.exponentialRampToValueAtTime(0.05, t0 + 0.02);
          sg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
          so.connect(sg); sg.connect(c.destination);
          so.start(t0); so.stop(t0 + 0.55);
        });
      }
    } catch { /* audio unsupported */ }
  }, [getAudioCtx]);

  const vibrate = useCallback((pattern) => {
    if (navigator.vibrate) try { navigator.vibrate(pattern); } catch { /* noop */ }
  }, []);

  // ─── Get bride's ring finger center (drop target) ───
  const getTargetPoint = useCallback(() => {
    if (!brideWrapRef.current || !stageRef.current) return { x: 0, y: 0, r: 60 };
    const br = brideWrapRef.current.getBoundingClientRect();
    const sr = stageRef.current.getBoundingClientRect();
    // Target point: roughly the ring finger area (left-center of bride's hand image)
    return {
      x: br.left + br.width * 0.35 - sr.left,
      y: br.top + br.height * 0.55 - sr.top,
      r: br.width * 0.18,
    };
  }, []);

  // ─── Get groom hand center ───
  const getGroomCenter = useCallback(() => {
    if (!groomRef.current || !stageRef.current) return { x: 0, y: 0 };
    const gr = groomRef.current.getBoundingClientRect();
    const sr = stageRef.current.getBoundingClientRect();
    return {
      x: gr.left + gr.width / 2 - sr.left,
      y: gr.top + gr.height / 2 - sr.top,
    };
  }, []);

  // ─── Apply flat transform (no 3D tilt) ───
  const applyTransform = useCallback((lifted) => {
    if (!groomRef.current) return;
    const { x, y } = pos.current;
    const scale = lifted ? 1.05 : 1;
    const shadow = lifted
      ? 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))'
      : 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))';
    groomRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    groomRef.current.style.filter = shadow;
  }, []);

  // ─── Sparkle Burst ───
  const burstSparkles = useCallback((originX, originY) => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = stage.clientWidth * dpr;
    canvas.height = stage.clientHeight * dpr;
    canvas.style.width = stage.clientWidth + 'px';
    canvas.style.height = stage.clientHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const particles = [];
    for (let i = 0; i < 40; i++) {
      const ang = Math.random() * Math.PI * 2;
      const speed = 1.6 + Math.random() * 4;
      particles.push({
        x: originX, y: originY,
        vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed - 1,
        life: 1, decay: 0.013 + Math.random() * 0.012,
        size: 1.4 + Math.random() * 2.5,
        star: Math.random() < 0.35,
      });
    }

    const t0 = performance.now();
    function frame() {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      let alive = false;
      for (const p of particles) {
        if (p.life <= 0) continue;
        alive = true;
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.045; p.vx *= 0.985;
        p.life -= p.decay;

        ctx.save();
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.translate(p.x, p.y);

        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 4);
        glow.addColorStop(0, 'rgba(255,247,214,1)');
        glow.addColorStop(0.4, 'rgba(243,217,138,0.7)');
        glow.addColorStop(1, 'rgba(243,217,138,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fffdf3';
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      if (alive && performance.now() - t0 < 2200) {
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      }
    }
    requestAnimationFrame(frame);
  }, []);

  // ─── Lock: crossfade + auto-scroll ───
  const lockRing = useCallback(() => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setLocked(true);

    if (rafMomentum.current) {
      cancelAnimationFrame(rafMomentum.current);
      rafMomentum.current = null;
    }

    // Snap groom hand to target
    const tp = getTargetPoint();
    const gc = getGroomCenter();
    pos.current.x += tp.x - gc.x;
    pos.current.y += tp.y - gc.y;

    if (groomRef.current) {
      groomRef.current.style.transition = 'transform 0.3s cubic-bezier(.2,1,.3,1), opacity 0.3s ease 0.15s, filter 0.3s ease';
      applyTransform(false);
      // Fade out groom hand after snap
      setTimeout(() => {
        if (groomRef.current) groomRef.current.style.opacity = '0';
      }, 100);
    }


    vibrate([10, 30, 10, 60, 18]);

    // Hide hint
    if (hintRef.current) hintRef.current.style.opacity = '0';

    // Crossfade: bride bare → bride with ring
    setTimeout(() => {
      if (brideRingRef.current) brideRingRef.current.classList.add('show');

      // Sparkle at the ring position
      const sparkleTarget = getTargetPoint();
      burstSparkles(sparkleTarget.x, sparkleTarget.y);
    }, 300);

    // Show celebration text
    setTimeout(() => {
      if (celebrationRef.current) celebrationRef.current.classList.add('show');
    }, 700);

    // Auto-scroll to next page after 1 second
    setTimeout(() => {
      const nextPage = stageRef.current?.nextElementSibling;
      if (nextPage) {
        nextPage.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1800);
  }, [getTargetPoint, getGroomCenter, applyTransform, playSound, vibrate, burstSparkles]);

  // ─── Main Effect: Pointer drag + momentum ───
  useEffect(() => {
    const stage = stageRef.current;
    const groom = groomRef.current;
    if (!stage || !groom) return;

    function startMomentum() {
      const friction = 0.92;
      function step() {
        pos.current.x += velocity.current.x;
        pos.current.y += velocity.current.y;
        velocity.current.x *= friction;
        velocity.current.y *= friction;

        const tp = getTargetPoint();
        const gc = getGroomCenter();
        const dtx = tp.x - gc.x;
        const dty = tp.y - gc.y;
        const dist = Math.sqrt(dtx * dtx + dty * dty);
        const pullRadius = tp.r * 5;

        if (dist < pullRadius) {
          if (!magnetActive.current) {
            magnetActive.current = true;
            playSound('tick');
            vibrate(12);
          }
          const strength = Math.pow(1 - dist / pullRadius, 1.6);
          pos.current.x += dtx * strength * 0.2;
          pos.current.y += dty * strength * 0.2;
          if (dist < tp.r * 2.2) {
            lockRing();
            return;
          }
        }

        const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);
        applyTransform(speed > 0.4);

        // Spring back home
        if (speed < 0.15 && !magnetActive.current) {
          pos.current.x += (0 - pos.current.x) * 0.1;
          pos.current.y += (0 - pos.current.y) * 0.1;
          applyTransform(false);
          if (Math.abs(pos.current.x) < 0.6 && Math.abs(pos.current.y) < 0.6) {
            pos.current = { x: 0, y: 0 };
            applyTransform(false);
            return;
          }
        }
        rafMomentum.current = requestAnimationFrame(step);
      }
      rafMomentum.current = requestAnimationFrame(step);
    }

    function onPointerDown(e) {
      if (lockedRef.current) return;
      dragging.current = true;
      groom.classList.add('dragging');
      if (groom.setPointerCapture) groom.setPointerCapture(e.pointerId);
      startPointer.current = { x: e.clientX, y: e.clientY };
      lastPointer.current = { x: e.clientX, y: e.clientY, t: performance.now() };
      velocity.current = { x: 0, y: 0 };
      playSound('pickup');
      vibrate(8);
      if (hintRef.current) hintRef.current.style.opacity = '0.3';
      if (rafMomentum.current) {
        cancelAnimationFrame(rafMomentum.current);
        rafMomentum.current = null;
      }
      e.preventDefault();
    }

    function onPointerMove(e) {
      if (!dragging.current) return;
      const now = performance.now();
      const dt = Math.max(now - lastPointer.current.t, 1);

      pos.current.x = e.clientX - startPointer.current.x;
      pos.current.y = e.clientY - startPointer.current.y;

      velocity.current.x = (e.clientX - lastPointer.current.x) / dt * 16;
      velocity.current.y = (e.clientY - lastPointer.current.y) / dt * 16;
      lastPointer.current = { x: e.clientX, y: e.clientY, t: now };

      // Magnetic pull near target
      const tp = getTargetPoint();
      const gc = getGroomCenter();
      const dtx = tp.x - gc.x;
      const dty = tp.y - gc.y;
      const dist = Math.sqrt(dtx * dtx + dty * dty);
      const pullRadius = tp.r * 5;

      if (dist < pullRadius) {
        if (!magnetActive.current) {
          magnetActive.current = true;
          playSound('tick');
          vibrate(12);
        }
        const strength = Math.pow(1 - dist / pullRadius, 1.6) * 0.45;
        pos.current.x += dtx * strength * 0.5;
        pos.current.y += dty * strength * 0.5;
      } else if (magnetActive.current) {
        magnetActive.current = false;
      }

      applyTransform(true);
      e.preventDefault();
    }

    function onPointerUp() {
      if (!dragging.current) return;
      dragging.current = false;
      groom.classList.remove('dragging');
      if (hintRef.current) hintRef.current.style.opacity = '0.65';

      const tp = getTargetPoint();
      const gc = getGroomCenter();
      const dtx = tp.x - gc.x;
      const dty = tp.y - gc.y;
      const dist = Math.sqrt(dtx * dtx + dty * dty);

      if (dist < tp.r * 3.5) {
        lockRing();
      } else {
        magnetActive.current = false;
        startMomentum();
      }
    }

    groom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    // Keyboard a11y
    function onKeyDown(e) {
      if (e.key === 'Enter' || e.key === ' ') lockRing();
    }
    groom.addEventListener('keydown', onKeyDown);

    return () => {
      if (rafMomentum.current) cancelAnimationFrame(rafMomentum.current);
      groom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      groom.removeEventListener('keydown', onKeyDown);
    };
  }, [applyTransform, getTargetPoint, getGroomCenter, playSound, vibrate, lockRing]);

  // ─── Floating dust motes ───
  const motes = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    size: 2 + Math.random() * 3,
    left: Math.random() * 100,
    top: 30 + Math.random() * 60,
    drift: Math.random() * 30 - 15,
    duration: 8 + Math.random() * 7,
    delay: Math.random() * 8,
  }));

  return (
    <section className="page-section ring-page" ref={stageRef} id="ring">
      {/* Dark atmospheric background */}
      <div className="ring-page__bg">
        <div className="ring-page__bg-gradient" />
      </div>

      {/* Floating gold dust */}
      <div className="ring-page__motes">
        {motes.map((m) => (
          <div
            key={m.id}
            className="ring-mote"
            style={{
              width: m.size + 'px',
              height: m.size + 'px',
              left: m.left + '%',
              top: m.top + '%',
              '--drift': m.drift + 'px',
              animationDuration: m.duration + 's',
              animationDelay: m.delay + 's',
            }}
          />
        ))}
      </div>

      {/* Instruction text */}
      <div className="ring-page__header">
        <p className="ring-page__eyebrow">The Ceremony</p>
        <h2 className="ring-page__title">
          Place the ring<br />on <em>her</em> hand
        </h2>
        <p className="ring-page__hint" ref={hintRef}>
          Touch & slide his hand toward hers
        </p>
      </div>

      {/* === Scene: Two hands === */}
      <div className="ring-scene">
        {/* Bride's hand — right side (static target) */}
        <div className="ring-bride-wrap" ref={brideWrapRef}>
          <img
            src={config.images.brideHandBare}
            alt=""
            className="ring-bride-bare"
            draggable="false"
          />
          <img
            ref={brideRingRef}
            src={config.images.brideHandRing}
            alt="Ring on finger"
            className="ring-bride-ring"
            draggable="false"
          />
        </div>

        {/* Groom's hand — left side (draggable) */}
        <div
          className={`ring-groom ${locked ? 'locked' : ''}`}
          ref={groomRef}
          role="button"
          tabIndex={0}
          aria-label="Drag the groom's hand to place the ring"
        >
          <img
            src={config.images.groomHandSide}
            alt="Groom holding ring"
            className="ring-groom__img"
            draggable="false"
          />
        </div>
      </div>

      {/* Sparkle canvas */}
      <canvas className="ring-sparkle-canvas" ref={canvasRef} />

      {/* Celebration text */}
      <div className="ring-celebration" ref={celebrationRef}>
        <p className="ring-celebration__text script-text gold-text">Forever begins now</p>
      </div>
    </section>
  );
}
