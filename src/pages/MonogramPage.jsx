import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { config } from '../config';
import './MonogramPage.css';

export default function MonogramPage() {
  const containerRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            playAnimation();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  function playAnimation() {
    const tl = gsap.timeline();

    // Background image fades in
    tl.fromTo('.monogram-bg__img',
      { opacity: 0, scale: 1.1 },
      { opacity: 0.3, scale: 1, duration: 2, ease: 'power2.out' }
    );

    // Ornamental lines sweep in
    tl.fromTo('.ornament-line--left',
      { scaleX: 0 },
      { scaleX: 1, duration: 1, ease: 'power2.inOut' },
      '-=1.2'
    );

    tl.fromTo('.ornament-line--right',
      { scaleX: 0 },
      { scaleX: 1, duration: 1, ease: 'power2.inOut' },
      '-=0.9'
    );

    // Monogram circle border draws
    tl.fromTo('.monogram-circle',
      { opacity: 0, scale: 0.7, rotate: -10 },
      { opacity: 1, scale: 1, rotate: 0, duration: 1, ease: 'back.out(1.2)' },
      '-=0.5'
    );

    // Initials appear
    tl.fromTo('.monogram-initials',
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.4'
    );

    // Gold shimmer
    tl.fromTo('.monogram-circle__shimmer',
      { rotate: 0 },
      { rotate: 360, duration: 3, ease: 'none', repeat: -1 }
    );

    // Names fade in with stagger
    tl.fromTo('.monogram-name',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.2, ease: 'power2.out' },
      '-=3'
    );

    // Tagline
    tl.fromTo('.monogram-tagline',
      { opacity: 0, letterSpacing: '0.3em' },
      { opacity: 1, letterSpacing: '0.06em', duration: 0.8, ease: 'power2.out' },
      '-=0.3'
    );
  }

  return (
    <section className="page-section monogram-page" ref={containerRef} id="monogram">
      {/* Photographic background */}
      <div className="monogram-bg">
        <img
          src={config.images.darkFloral}
          alt=""
          className="monogram-bg__img"
          loading="lazy"
        />
        <div className="monogram-bg__overlay"></div>
      </div>

      {/* Ornamental lines */}
      <div className="ornament-line ornament-line--left"></div>
      <div className="ornament-line ornament-line--right"></div>

      {/* Monogram */}
      <div className="monogram-container">
        <div className="monogram-circle">
          <div className="monogram-circle__shimmer"></div>
          <div className="monogram-circle__border">
            <div className="monogram-circle__inner">
              <span className="monogram-initials script-text">
                {config.couple.monogramInitials}
              </span>
            </div>
          </div>
        </div>

        <div className="monogram-names-block">
          <h2 className="monogram-name monogram-name--groom">
            {config.couple.groomFirstName} {config.couple.groomLastName}
          </h2>
          <div className="monogram-amp-wrapper">
            <span className="monogram-amp script-text">&</span>
          </div>
          <h2 className="monogram-name monogram-name--bride">
            {config.couple.brideFirstName} {config.couple.brideLastName}
          </h2>
        </div>

        <p className="monogram-tagline">{config.couple.tagline}</p>

        <div className="monogram-date">
          <span>{config.date.full}</span>
        </div>
      </div>
    </section>
  );
}
