/**
 * Da3wa Book — Central Configuration
 * 
 * Edit this file to customize the wedding invitation.
 * All pages pull their content from here.
 */

// Get base URL for GitHub Pages deployment
const base = import.meta.env.BASE_URL;

// Helper for local assets
const asset = (path) => `${base}${path.replace(/^\//, '')}`;

// Curated high-quality stock images from Unsplash (free to use)
const IMAGES = {
  // Atmospheric / Backgrounds
  bokehBg: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1920&q=80&auto=format',
  darkFloral: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=1920&q=80&auto=format',
  darkMoody: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80&auto=format',
  
  // Wedding scenes
  weddingArch: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80&auto=format',
  weddingVenue: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80&auto=format',
  
  // Rings
  weddingRings: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80&auto=format',
  ringClose: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80&auto=format',
  
  // Couple / romantic (placeholder memories)
  couple1: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80&auto=format',
  couple2: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&q=80&auto=format',
  couple3: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80&auto=format',
  couple4: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80&auto=format',
  
  // Ring ceremony — 3 transparent PNG assets
  groomHandSide: asset('/images/groom-hand-side.png'),     // Draggable: groom holding ring
  brideHandBare: asset('/images/bride-hand-bare.png'),      // Target: bride's bare hand
  brideHandRing: asset('/images/bride-hand-ring.png'),      // Success: bride wearing ring
  
  // Marble / textures
  darkMarble: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&q=80&auto=format',
  goldTexture: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=800&q=80&auto=format',
  
  // Flowers
  darkFlowers: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=1200&q=80&auto=format',
  whiteRoses: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=1200&q=80&auto=format',
};

export const config = {
  couple: {
    groomFirstName: "Ahmed",
    groomLastName: "Al-Rashid",
    brideFirstName: "Layla",
    brideLastName: "Hassan",
    monogramInitials: "A & L",
    tagline: "Two souls, one beautiful journey",
  },

  date: {
    full: "Saturday, November 15th, 2026",
    short: "11.15.2026",
    time: "5:30 PM",
  },

  venue: {
    ceremony: {
      name: "The Grand Garden Pavilion",
      address: "123 Rose Garden Lane, Dubai, UAE",
      time: "6:00 PM",
      mapsUrl: "https://maps.google.com/?q=The+Grand+Garden+Pavilion+Dubai",
    },
    reception: {
      name: "The Crystal Ballroom",
      address: "456 Diamond Blvd, Dubai, UAE",
      time: "8:00 PM",
      mapsUrl: "https://maps.google.com/?q=The+Crystal+Ballroom+Dubai",
    },
  },



  memories: [
    { src: IMAGES.couple1, caption: "Where it all started" },
    { src: IMAGES.couple2, caption: "The Proposal" },
    { src: IMAGES.couple3, caption: "Our Engagement" },
    { src: IMAGES.couple4, caption: "Together Forever" },
  ],

  images: IMAGES,

  rsvp: {
    googleScriptUrl: import.meta.env.VITE_RSVP_SCRIPT_URL || "",
  },

  music: {
    src: asset('/bg-music.m4a'),
  },
};
