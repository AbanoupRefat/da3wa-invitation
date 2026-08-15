import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { config } from '../config';
import ScrollIndicator from '../components/ScrollIndicator';
import './WelcomePage.css';

export default function WelcomePage() {
  const containerRef = useRef(null);
  const envelopeRef = useRef(null);
  const flapRef = useRef(null);
  const cardRef = useRef(null);
  const hasAnimated = useRef(false);

  useGSAP(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const tl = gsap.timeline({ delay: 0.8 });

    // Ambient particles fade in
    tl.fromTo('.welcome-particle',
      { opacity: 0 },
      { opacity: 1, duration: 1.5, stagger: 0.1, ease: 'power1.inOut' },
      0
    );

    // Envelope fades up
    tl.fromTo(envelopeRef.current,
      { opacity: 0, scale: 0.85, y: 60 },
      { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out' },
      0.3
    );

    // Flap opens (3D)
    tl.to(flapRef.current, {
      rotateX: 180,
      duration: 1,
      ease: 'power2.inOut',
    }, '+=0.5');

    // Wax seal fades out as flap opens
    tl.to('.envelope__seal', {
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
    }, '-=0.8');

    // Card slides up from within the envelope
    tl.fromTo(cardRef.current,
      { y: 0, opacity: 0 },
      { y: -260, opacity: 1, duration: 1.2, ease: 'power3.out' },
      '-=0.3'
    );

    // Card inner gold border glow
    tl.to('.invitation-card__border', {
      boxShadow: '0 0 40px rgba(201, 162, 75, 0.2), inset 0 0 30px rgba(201, 162, 75, 0.05)',
      duration: 0.8,
    }, '-=0.5');

    // Staggered card content reveal
    tl.fromTo('.card-content__invited',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    );

    tl.fromTo('.card-content__divider',
      { scaleX: 0 },
      { scaleX: 1, duration: 0.5, ease: 'power2.inOut' },
      '-=0.2'
    );

    tl.fromTo('.card-content__names',
      { opacity: 0, y: 20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.2'
    );

    tl.fromTo('.card-content__tagline',
      { opacity: 0, letterSpacing: '0.3em' },
      { opacity: 1, letterSpacing: '0.08em', duration: 0.7, ease: 'power2.out' },
      '-=0.4'
    );

    tl.fromTo('.card-content__date-block',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    );

    // Gold shimmer across the whole card
    tl.fromTo('.card-shimmer',
      { x: '-150%' },
      { x: '250%', duration: 1.5, ease: 'power1.inOut' },
      '-=0.3'
    );

  }, { scope: containerRef });

  return (
    <section className="page-section welcome-page" ref={containerRef} id="welcome">
      {/* Full photographic background */}
      <div className="welcome-page__bg">
        <img
          src={config.images.darkFloral}
          alt=""
          className="welcome-page__bg-img"
          loading="eager"
        />
        <div className="welcome-page__bg-overlay"></div>
      </div>

      {/* Floating ambient particles */}
      <div className="welcome-page__particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="welcome-particle"
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${5 + Math.random() * 90}%`,
              width: `${2 + Math.random() * 5}px`,
              height: `${2 + Math.random() * 5}px`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

      {/* Envelope */}
      <div className="envelope-wrapper" ref={envelopeRef}>
        <div className="envelope">
          {/* Envelope body with real texture */}
          <div className="envelope__body">
            <div className="envelope__texture"></div>
            <div className="envelope__inner-shadow"></div>

            {/* Wax seal */}
            <div className="envelope__seal">
              <div className="envelope__seal-inner">
                <span>{config.couple.groomFirstName[0]}</span>
                <span className="seal-heart">♥</span>
                <span>{config.couple.brideFirstName[0]}</span>
              </div>
            </div>
          </div>

          {/* Envelope flap — 3D animated */}
          <div className="envelope__flap-wrapper" ref={flapRef}>
            <div className="envelope__flap">
              <div className="envelope__flap-texture"></div>
            </div>
          </div>
        </div>

        {/* Invitation Card */}
        <div className="invitation-card" ref={cardRef}>
          <div className="card-shimmer"></div>
          <div className="invitation-card__border">
            <div className="invitation-card__inner-border">
              <div className="invitation-card__content card-content">
                <p className="card-content__invited">You are cordially invited<br/>to celebrate the marriage of</p>

                <div className="card-content__divider"></div>

                <h1 className="card-content__names script-text">
                  {config.couple.groomFirstName}
                  <span className="names-ampersand">&</span>
                  {config.couple.brideFirstName}
                </h1>

                <p className="card-content__tagline">{config.couple.tagline}</p>

                <div className="card-content__divider"></div>

                <div className="card-content__date-block">
                  <p className="card-content__date">{config.date.full}</p>
                  <p className="card-content__time">at {config.date.time}</p>
                </div>

                {/* Corner flourishes */}
                <div className="card-corner card-corner--tl">❧</div>
                <div className="card-corner card-corner--tr">❧</div>
                <div className="card-corner card-corner--bl">❧</div>
                <div className="card-corner card-corner--br">❧</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollIndicator text="Scroll to begin" />
    </section>
  );
}
