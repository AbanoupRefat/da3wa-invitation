import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { config } from '../config';
import './RSVPPage.css';

export default function RSVPPage() {
  const containerRef = useRef(null);
  const [formState, setFormState] = useState('idle'); // idle | submitting | success | error
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            const tl = gsap.timeline();

            tl.fromTo('.rsvp-page__title',
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
            );

            tl.fromTo('.rsvp-form-wrapper',
              { opacity: 0, y: 40, scale: 0.98 },
              { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState('submitting');

    const formData = new FormData(e.target);

    try {
      if (config.rsvp.googleScriptUrl) {
        await fetch(config.rsvp.googleScriptUrl, {
          method: 'POST',
          body: formData,
        });
      } else {
        // Mock submission when no URL configured
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      setFormState('success');

      // Success animation
      gsap.fromTo('.rsvp-success',
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.4)' }
      );
    } catch {
      setFormState('error');
    }
  };

  const resetForm = () => {
    setFormState('idle');
  };

  return (
    <section className="page-section rsvp-page" ref={containerRef} id="rsvp">
      <div className="rsvp-page__header">
        <h2 className="rsvp-page__title gold-text">RSVP</h2>
        <div className="gold-divider"></div>
        <p className="rsvp-page__subtitle">We would be honored by your presence</p>
      </div>

      {formState === 'success' ? (
        <div className="rsvp-success">
          <div className="rsvp-success__icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3 className="script-text gold-text">Thank You!</h3>
          <p>Your response has been recorded. We look forward to celebrating with you.</p>
        </div>
      ) : (
        <div className="rsvp-form-wrapper glass-card">
          <form className="rsvp-form" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="form-group">
              <label htmlFor="rsvp-name" className="form-label">Full Name</label>
              <input
                type="text"
                id="rsvp-name"
                name="name"
                className="form-input"
                placeholder="Enter your full name"
                required
              />
            </div>



            {/* Note */}
            <div className="form-group">
              <label htmlFor="rsvp-note" className="form-label">Personal Note <span className="optional">(optional)</span></label>
              <textarea
                id="rsvp-note"
                name="note"
                className="form-input form-textarea"
                placeholder="Share your wishes with the couple..."
                rows="3"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="gold-button rsvp-submit"
              disabled={formState === 'submitting'}
            >
              {formState === 'submitting' ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                'Send RSVP'
              )}
            </button>

            {formState === 'error' && (
              <div className="rsvp-error">
                <p>Something went wrong. Please try again.</p>
                <button type="button" onClick={resetForm} className="retry-link">
                  Try again
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Footer */}
      <footer className="rsvp-footer">
        <p className="script-text gold-text">
          {config.couple.groomFirstName} & {config.couple.brideFirstName}
        </p>
        <p className="rsvp-footer__date">{config.date.short}</p>
      </footer>
    </section>
  );
}
