import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { config } from '../config';
import './VenuePage.css';

export default function VenuePage() {
  const containerRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            const tl = gsap.timeline();

            tl.fromTo('.venue-page__title',
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
            );

            tl.fromTo('.venue-card--ceremony',
              { opacity: 0, x: -50 },
              { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
              '-=0.3'
            );



            // Gold underline draw
            tl.fromTo('.venue-card__name-line',
              { scaleX: 0 },
              { scaleX: 1, duration: 0.6, ease: 'power2.inOut', stagger: 0.2 },
              '-=0.3'
            );
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const { ceremony, reception } = config.venue;

  return (
    <section className="page-section venue-page" ref={containerRef} id="venue">
      <div className="venue-page__header">
        <h2 className="venue-page__title gold-text">Venue Details</h2>
        <div className="gold-divider"></div>
      </div>

      <div className="venue-cards">
        {/* Ceremony */}
        <div className="venue-card venue-card--ceremony glass-card">
          <div className="venue-card__icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="venue-card__label">The Ceremony</span>
          <h3 className="venue-card__name">
            {ceremony.name}
            <div className="venue-card__name-line"></div>
          </h3>
          <div className="venue-card__details">
            <div className="venue-detail">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{ceremony.time}</span>
            </div>
            <div className="venue-detail">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{ceremony.address}</span>
            </div>
          </div>
          <a
            href={ceremony.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="venue-card__map-link gold-button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            View on Map
          </a>
        </div>


      </div>
    </section>
  );
}
