/**
 * ============================================================
 *  SITE_CONFIG — Master Configuration for Real Estate Website
 * ============================================================
 *  HOW TO REBRAND IN < 5 MINUTES:
 *  1. Update "brand" section with your client's details.
 *  2. Update "hero" section headlines and stats.
 *  3. Toggle sections on/off in "enableSections".
 *  4. Replace the "properties" array with real listings.
 *  5. Update "testimonials" and "neighborhoodHighlights".
 *  6. In style.css, change the 5 CSS variables under :root.
 *  Done! No HTML markup needs to change.
 * ============================================================
 */

const SITE_CONFIG = {

  // ─── BRAND ───────────────────────────────────────────────
  brand: {
    companyName:    "Prestige Realty",
    tagline:        "Building Dreams, Delivering Trust",
    /** Leave logoUrl empty ("") to auto-render a text logo */
    logoUrl:        "",
    reraNumber:     "RERA/KA/PRJ/2024/001234",
    phone:          "+91 98765 43210",
    whatsappNumber: "919876543210",   // digits only, with country code
    email:          "info@prestigerealty.in",
    officeAddress:  "101, Brigade Tower, MG Road, Bangalore – 560001",
    footerText:     "© 2025 Prestige Realty. All rights reserved. | RERA Approved | Trusted by 1000+ Families",
    socialLinks: {
      facebook:  "https://facebook.com",
      instagram: "https://instagram.com",
      youtube:   "https://youtube.com",
      linkedin:  "https://linkedin.com"
    }
  },

  // ─── HERO SECTION ────────────────────────────────────────
  hero: {
    badge:           "RERA Approved | Bangalore's #1 Trusted Builder",
    title:           "Find Your <span class='highlight'>Dream Home</span><br>in Bangalore",
    subtitle:        "Luxury apartments, premium villas & smart commercial spaces — crafted for the life you deserve.",
    backgroundImage: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80",
    ctaPrimary:      "Explore Properties",
    ctaSecondary:    "Book Site Visit",

    /** 4 Key Stats shown in the bottom bar of the hero */
    stats: [
      { icon: "🏡", value: "143+",        label: "Homes Delivered" },
      { icon: "🏊", value: "10,000 Sq.Ft", label: "Clubhouse" },
      { icon: "✅", value: "RERA",         label: "Approved" },
      { icon: "🏆", value: "10+ Years",    label: "Experience" }
    ]
  },

  // ─── SECTION TOGGLES ─────────────────────────────────────
  /**
   * Set any value to false to completely hide that section.
   * Perfect for clients who don't need every feature.
   */
  enableSections: {
    showStats:                true,
    showPropertyGrid:         true,
    showFloorStack:           true,
    showCalculators:          true,   // EMI & rental yield in modals
    showLocationIntelligence: true,
    showTestimonials:         true,
    showVideoTour:            true,
    showNeighborhood:         true,
    showContactForm:          true
  },

  // ─── VIDEO TOUR ──────────────────────────────────────────
  videoTour: {
    heading:   "Experience the Project — Virtual Tour",
    subheading:"Walk through our flagship project from anywhere.",
    /** Replace with a real YouTube embed URL for the client */
    embedUrl:  "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1"
  },

  // ─── PROPERTIES ──────────────────────────────────────────
  /**
   * category:     "Buy" | "Rent" | "Commercial"
   * propertyType: "Apartment" | "Villa" | "Office" | "Retail Shop" | "PG/Co-living"
   * status:       "Ready to Move" | "Under Construction" | "New Launch"
   * priceNumeric: number in Lakhs (Buy) or monthly rent (Rent/Commercial)
   */
  properties: [
    {
      id:            "PR001",
      title:         "The Prestige Grand — 3 BHK",
      category:      "Buy",
      propertyType:  "Apartment",
      location:      "Whitefield, Bangalore",
      priceNumeric:  120,
      priceDisplay:  "₹1.20 Cr",
      areaSqFt:      1850,
      configuration: "3 BHK",
      status:        "Ready to Move",
      reraId:        "RERA/KA/001",
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"
      ],
      floorPlanUrl:  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      amenities:     ["Swimming Pool", "Gym", "24/7 Security", "Power Backup", "Clubhouse", "Children's Play Area", "Landscaped Garden", "Covered Parking"],
      highlights:    ["Corner unit with 270° view", "Vaastu compliant", "Modular kitchen included", "Smart home pre-wired"],
      nearbyLandmarks: [
        { name: "Kempegowda International Airport", distance: "35 km", time: "45 min" },
        { name: "ITPL IT Park",                      distance: "3 km",  time: "10 min" },
        { name: "Columbia Asia Hospital",             distance: "2 km",  time: "7 min"  },
        { name: "Vibgyor High School",                distance: "1.5 km",time: "5 min"  }
      ]
    },
    {
      id:            "PR002",
      title:         "Prestige Villas — 4 BHK Independent",
      category:      "Buy",
      propertyType:  "Villa",
      location:      "Sarjapur Road, Bangalore",
      priceNumeric:  285,
      priceDisplay:  "₹2.85 Cr",
      areaSqFt:      3200,
      configuration: "4 BHK + Study",
      status:        "New Launch",
      reraId:        "RERA/KA/002",
      images: [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80"
      ],
      floorPlanUrl:  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      amenities:     ["Private Pool", "Home Theatre", "Smart Home Automation", "EV Charging", "Servant Quarters", "Terrace Garden", "3-Car Garage", "Solar Panels"],
      highlights:    ["Gated community of 24 villas", "Private garden 1200 sq.ft.", "Rain water harvesting", "German-brand fittings"],
      nearbyLandmarks: [
        { name: "Kempegowda International Airport", distance: "55 km", time: "70 min" },
        { name: "RGA Tech Park",                    distance: "4 km",  time: "12 min" },
        { name: "Narayana Hospital",                distance: "3 km",  time: "10 min" },
        { name: "Oakridge International School",    distance: "2 km",  time: "6 min"  }
      ]
    },
    {
      id:            "PR003",
      title:         "Sky Residences — 2 BHK Premium",
      category:      "Buy",
      propertyType:  "Apartment",
      location:      "Hebbal, Bangalore",
      priceNumeric:  75,
      priceDisplay:  "₹75 Lakhs",
      areaSqFt:      1200,
      configuration: "2 BHK",
      status:        "Under Construction",
      reraId:        "RERA/KA/003",
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80",
        "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80",
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
      ],
      floorPlanUrl:  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      amenities:     ["Rooftop Infinity Pool", "Co-working Space", "Yoga Deck", "Concierge Service", "Gymnasium", "Intercom", "Visitor Parking"],
      highlights:    ["Lake-facing units available", "Completion: Dec 2025", "Zero maintenance for 2 years", "Home loan tie-ups with 12 banks"],
      nearbyLandmarks: [
        { name: "Kempegowda International Airport", distance: "15 km", time: "25 min" },
        { name: "Manyata Tech Park",                distance: "5 km",  time: "15 min" },
        { name: "Manipal Hospital",                 distance: "4 km",  time: "12 min" },
        { name: "Delhi Public School",              distance: "2 km",  time: "6 min"  }
      ]
    },
    {
      id:            "PR004",
      title:         "Brigade Luxuria — 3 BHK Furnished",
      category:      "Rent",
      propertyType:  "Apartment",
      location:      "Indiranagar, Bangalore",
      priceNumeric:  65000,
      priceDisplay:  "₹65,000/mo",
      areaSqFt:      1750,
      configuration: "3 BHK Furnished",
      status:        "Ready to Move",
      reraId:        "RERA/KA/004",
      images: [
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
        "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80",
        "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
      ],
      floorPlanUrl:  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      amenities:     ["Fully Furnished", "High-Speed WiFi Included", "Netflix/Prime Ready", "24/7 Security", "Gym Access", "Covered Parking"],
      highlights:    ["Walking distance to 100ft Road", "Corporate lease welcome", "Available immediately", "11-month rental agreement"],
      nearbyLandmarks: [
        { name: "HAL Airport",           distance: "8 km",  time: "20 min" },
        { name: "Bagmane Tech Park",      distance: "6 km",  time: "18 min" },
        { name: "Manipal Hospital",       distance: "2 km",  time: "6 min"  },
        { name: "Frank Anthony School",   distance: "1 km",  time: "4 min"  }
      ]
    },
    {
      id:            "PR005",
      title:         "Studio Smart — PG Premium",
      category:      "Rent",
      propertyType:  "PG/Co-living",
      location:      "Koramangala, Bangalore",
      priceNumeric:  18000,
      priceDisplay:  "₹18,000/mo",
      areaSqFt:      320,
      configuration: "1 BHK Studio",
      status:        "Ready to Move",
      reraId:        "N/A",
      images: [
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
        "https://images.unsplash.com/photo-1486304873000-235643847519?w=800&q=80",
        "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80"
      ],
      floorPlanUrl:  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      amenities:     ["All Meals Included", "High-Speed WiFi", "Laundry Service", "Housekeeping", "Common Room", "CCTV Security"],
      highlights:    ["5-min walk to Koramangala 5th Block", "Co-working space on premises", "24/7 help desk", "No brokerage"],
      nearbyLandmarks: [
        { name: "Forum Mall",          distance: "1 km",  time: "5 min"  },
        { name: "EGL Tech Park",       distance: "3 km",  time: "10 min" },
        { name: "St. John's Hospital", distance: "2 km",  time: "7 min"  },
        { name: "Jyoti Nivas College", distance: "1 km",  time: "4 min"  }
      ]
    },
    {
      id:            "PR006",
      title:         "Prestige Commerce — Grade A Office",
      category:      "Commercial",
      propertyType:  "Office",
      location:      "MG Road, Bangalore",
      priceNumeric:  180000,
      priceDisplay:  "₹1.80 Lac/mo",
      areaSqFt:      3500,
      configuration: "Open Floor + 6 Cabins",
      status:        "Ready to Move",
      reraId:        "RERA/KA/006",
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
      ],
      floorPlanUrl:  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      amenities:     ["Dedicated Reception", "Conference Rooms", "Cafeteria", "High-Speed Fibre", "Generator Backup", "Ample Parking", "24/7 Security", "Central AC"],
      highlights:    ["Prime MG Road address", "Metro station 200m away", "Flexi-fit layout", "Retail frontage available"],
      nearbyLandmarks: [
        { name: "Kempegowda International Airport", distance: "35 km", time: "50 min" },
        { name: "UB City",                          distance: "0.5 km",time: "3 min"  },
        { name: "Manipal Hospital",                 distance: "5 km",  time: "15 min" },
        { name: "MG Road Metro Station",            distance: "0.2 km",time: "2 min"  }
      ]
    },
    {
      id:            "PR007",
      title:         "High Street Retail — Ground Floor",
      category:      "Commercial",
      propertyType:  "Retail Shop",
      location:      "HSR Layout, Bangalore",
      priceNumeric:  45,
      priceDisplay:  "₹45 Lakhs",
      areaSqFt:      650,
      configuration: "Ground Floor Shop",
      status:        "New Launch",
      reraId:        "RERA/KA/007",
      images: [
        "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80",
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
        "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=800&q=80",
        "https://images.unsplash.com/photo-1467533003447-e295ff1b0435?w=800&q=80"
      ],
      floorPlanUrl:  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      amenities:     ["High Street Frontage", "Dedicated Parking", "CCTV", "Signage Rights", "Power Backup", "24/7 Access"],
      highlights:    ["Corner shop — 2 frontages", "Walk-in customer traffic 5000+/day", "Ideal for F&B, Salon, Clinic", "Easy bank loan approval"],
      nearbyLandmarks: [
        { name: "Kempegowda International Airport", distance: "40 km", time: "55 min" },
        { name: "EGL Tech Park",                    distance: "5 km",  time: "15 min" },
        { name: "Apollo Hospital",                  distance: "4 km",  time: "12 min" },
        { name: "National Games Village School",    distance: "2 km",  time: "6 min"  }
      ]
    },
    {
      id:            "PR008",
      title:         "Prestige Heights — 1 BHK Smart",
      category:      "Buy",
      propertyType:  "Apartment",
      location:      "Electronic City, Bangalore",
      priceNumeric:  48,
      priceDisplay:  "₹48 Lakhs",
      areaSqFt:      680,
      configuration: "1 BHK",
      status:        "Under Construction",
      reraId:        "RERA/KA/008",
      images: [
        "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80",
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80",
        "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80",
        "https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=800&q=80"
      ],
      floorPlanUrl:  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      amenities:     ["Gymnasium", "Swimming Pool", "CCTV Security", "Power Backup", "Covered Parking", "24/7 Water Supply"],
      highlights:    ["Ideal for IT professionals", "10 min to Infosys campus", "Possession Q2 2026", "10% at booking, easy payment plan"],
      nearbyLandmarks: [
        { name: "Kempegowda International Airport", distance: "50 km", time: "65 min" },
        { name: "Infosys Electronic City",           distance: "2 km",  time: "7 min"  },
        { name: "Narayana Hrudayalaya Hospital",     distance: "3 km",  time: "10 min" },
        { name: "Delhi Public School EC",            distance: "1 km",  time: "4 min"  }
      ]
    }
  ],

  // ─── TESTIMONIALS ────────────────────────────────────────
  testimonials: [
    {
      name:    "Rajesh & Priya Sharma",
      location:"Whitefield, Bangalore",
      rating:  5,
      photo:   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      text:    "Prestige Realty made our dream home a reality. The process was completely transparent, and the team guided us at every step — from site visits to loan assistance. Couldn't be happier!"
    },
    {
      name:    "Ananya Krishnamurthy",
      location:"Koramangala, Bangalore",
      rating:  5,
      photo:   "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      text:    "I was investing in commercial property for the first time. The team's location intelligence report and rental yield calculator helped me make a confident, data-backed decision. Superb!"
    },
    {
      name:    "Vikram Patel",
      location:"Sarjapur, Bangalore",
      rating:  5,
      photo:   "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
      text:    "The virtual site visit feature saved me so much time as an NRI. Everything from paperwork to registration was handled seamlessly. I'd recommend Prestige Realty to every NRI buyer."
    },
    {
      name:    "Meera & Suresh Nair",
      location:"Hebbal, Bangalore",
      rating:  5,
      photo:   "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
      text:    "Booked our 2 BHK at Sky Residences and got possession 3 months early! The construction quality and the clubhouse amenities are beyond what was promised. Excellent builder."
    }
  ],

  // ─── NEIGHBORHOOD HIGHLIGHTS ─────────────────────────────
  neighborhoodHighlights: [
    { icon: "✈️", category: "Connectivity",  items: ["BIAL Airport — 35 min", "Namma Metro — 200m", "Bangalore Cantt Railway — 20 min", "NICE Ring Road — 5 min"] },
    { icon: "💼", category: "IT & Business", items: ["ITPL — 10 min", "Manyata Tech Park — 15 min", "RGA Tech Park — 12 min", "Bagmane Tech Park — 18 min"] },
    { icon: "🏥", category: "Healthcare",    items: ["Columbia Asia Hospital — 7 min", "Manipal Hospital — 12 min", "Apollo Hospital — 15 min", "Narayana Health City — 20 min"] },
    { icon: "🎓", category: "Education",     items: ["Vibgyor High School — 5 min", "Delhi Public School — 6 min", "New Horizon College — 10 min", "Christ University — 20 min"] },
    { icon: "🛒", category: "Lifestyle",     items: ["Phoenix Marketcity — 10 min", "Inorbit Mall — 12 min", "Forum Mall — 15 min", "Central Mall — 20 min"] }
  ],

  // ─── FLOOR STACK EXPLORER ────────────────────────────────
  floorStack: [
    { level: "Terrace",          icon: "🌊", label: "Infinity Pool & Sky Lounge",    description: "Resort-style rooftop infinity pool with panoramic city views, sun deck, and evening sky lounge for residents." },
    { level: "Floors 20–24",     icon: "👑", label: "Penthouse Residences",          description: "Ultra-luxury penthouses with private terraces, 4-5 BHK layouts, and double-height living rooms." },
    { level: "Floors 5–19",      icon: "🏠", label: "Premium Apartments",            description: "Spacious 2 & 3 BHK apartments with Italian marble flooring, modular kitchens, and city-view balconies." },
    { level: "Floor 4",          icon: "🏋️", label: "Clubhouse & Recreation",        description: "10,000 sq.ft. clubhouse featuring a fully equipped gym, indoor games room, banquet hall, and spa." },
    { level: "Floors 1–3",       icon: "💼", label: "Grade A Office Spaces",         description: "Plug-and-play office suites available from 500 to 5,000 sq.ft. with high-speed internet and meeting rooms." },
    { level: "Ground Floor",     icon: "🛍️", label: "High-Street Retail",            description: "Premium retail frontage along the main road with high foot traffic — ideal for F&B, pharmacy, and lifestyle brands." },
    { level: "Basement B1–B2",   icon: "🚗", label: "Basement Parking",              description: "2-level basement with 300+ covered parking bays, EV charging stations, and 24/7 CCTV surveillance." }
  ]

}; // End SITE_CONFIG
