import { useCallback, useRef } from 'react';
import gsap from 'gsap';

/**
 * SparkleEffect — Creates a burst of golden sparkle particles
 * Call triggerSparkle(x, y) to fire from a specific position
 */
export function useSparkleEffect(containerRef) {
  const canvasRef = useRef(null);

  const triggerSparkle = useCallback((originX, originY) => {
    if (!containerRef.current) return;

    // Create a temporary canvas overlay
    const canvas = document.createElement('canvas');
    const rect = containerRef.current.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 100;
    `;
    containerRef.current.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 40;

    // Relative position within container
    const cx = originX - rect.left;
    const cy = originY - rect.top;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 6;
      const size = 2 + Math.random() * 4;
      const life = 0.6 + Math.random() * 0.8;

      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        life,
        maxLife: life,
        color: Math.random() > 0.5 ? '#C9A24B' : '#E4C77D',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }

    // Animate
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = (currentTime - startTime) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = 0;

      particles.forEach((p) => {
        p.life -= 0.016;
        if (p.life <= 0) return;

        alive++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.vx *= 0.98; // friction
        p.rotation += p.rotationSpeed;

        const alpha = Math.max(0, p.life / p.maxLife);
        const currentSize = p.size * (0.5 + alpha * 0.5);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = alpha;

        // Draw a sparkle (4-pointed star)
        ctx.fillStyle = p.color;
        ctx.beginPath();
        const s = currentSize;
        ctx.moveTo(0, -s * 2);
        ctx.lineTo(s * 0.5, -s * 0.5);
        ctx.lineTo(s * 2, 0);
        ctx.lineTo(s * 0.5, s * 0.5);
        ctx.lineTo(0, s * 2);
        ctx.lineTo(-s * 0.5, s * 0.5);
        ctx.lineTo(-s * 2, 0);
        ctx.lineTo(-s * 0.5, -s * 0.5);
        ctx.closePath();
        ctx.fill();

        // Add glow
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8 * alpha;
        ctx.fill();

        ctx.restore();
      });

      if (alive > 0) {
        requestAnimationFrame(animate);
      } else {
        // Cleanup
        canvas.remove();
      }
    }

    requestAnimationFrame(animate);

    // Also animate some floating gold circles with GSAP
    for (let i = 0; i < 8; i++) {
      const dot = document.createElement('div');
      dot.style.cssText = `
        position: absolute;
        width: ${6 + Math.random() * 10}px;
        height: ${6 + Math.random() * 10}px;
        border-radius: 50%;
        background: radial-gradient(circle, #E4C77D, #C9A24B);
        left: ${cx}px;
        top: ${cy}px;
        pointer-events: none;
        z-index: 101;
      `;
      containerRef.current.appendChild(dot);

      const angle = (Math.PI * 2 * i) / 8;
      const dist = 40 + Math.random() * 80;

      gsap.to(dot, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 30,
        opacity: 0,
        scale: 0,
        duration: 0.8 + Math.random() * 0.4,
        ease: 'power2.out',
        onComplete: () => dot.remove(),
      });
    }
  }, [containerRef]);

  return { triggerSparkle };
}

export default useSparkleEffect;
