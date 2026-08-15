import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { config } from '../config';
import './MemoriesPage.css';

export default function MemoriesPage() {
  const containerRef = useRef(null);
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const memories = config.memories;

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Intersection Observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            gsap.fromTo('.memories-page__title',
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
            );
            gsap.fromTo('.memory-slide',
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.2 }
            );
            gsap.fromTo('.memories-dots',
              { opacity: 0 },
              { opacity: 1, duration: 0.5, delay: 0.8 }
            );
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const goToSlide = (index) => {
    setActiveIndex(index);
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.children[0]?.offsetWidth || 0;
      const gap = 24; // matches CSS gap
      gsap.to(sliderRef.current, {
        x: -(slideWidth + gap) * index,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  };

  const nextSlide = () => {
    const next = (activeIndex + 1) % memories.length;
    goToSlide(next);
  };

  const prevSlide = () => {
    const prev = (activeIndex - 1 + memories.length) % memories.length;
    goToSlide(prev);
  };

  return (
    <section className="page-section memories-page" ref={containerRef} id="memories">
      <div className="memories-page__header">
        <h2 className="memories-page__title gold-text">Our Story</h2>
        <div className="gold-divider"></div>
        <p className="memories-page__subtitle">A journey of love, captured in moments</p>
      </div>

      <div className="memories-slider-container">
        <button className="slider-arrow slider-arrow--prev" onClick={prevSlide} aria-label="Previous photo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div 
          className="memories-slider-viewport"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEndHandler}
        >
          <div className="memories-slider" ref={sliderRef}>
            {memories.map((memory, index) => (
              <div
                className={`memory-slide ${index === activeIndex ? 'active' : ''}`}
                key={index}
              >
                <div className="memory-slide__image-wrapper">
                  <div
                    className="memory-slide__image"
                    style={{
                      background: `linear-gradient(135deg, 
                        hsl(${30 + index * 25}, 40%, 25%) 0%, 
                        hsl(${40 + index * 20}, 35%, 15%) 100%)`,
                    }}
                  >
                    <img
                      src={memory.src}
                      alt={memory.caption}
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    {/* Placeholder icon when no image */}
                    <div className="memory-slide__placeholder">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  </div>
                  <div className="memory-slide__overlay"></div>
                </div>
                <div className="memory-slide__caption">
                  <span className="memory-slide__number">0{index + 1}</span>
                  <p>{memory.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="slider-arrow slider-arrow--next" onClick={nextSlide} aria-label="Next photo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Navigation dots */}
      <div className="memories-dots">
        {memories.map((_, index) => (
          <button
            key={index}
            className={`memories-dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to photo ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
