/* MOODS by Roxy — datele aplicației. DOAR TEXT: fără HTML, fără cod.
   Sursa textelor: site-ul (Mood s/site/*.html). null = dată lipsă, apare marcată cu galben.
   Ofertele și evenimentele dispar singure după data din "until". */
window.MOODS_DATA = {
  salon: {
    name: "MOODS by Roxy Salon",
    tagline: "Be all of her.",
    phone: "0721 781 200",
    phoneIntl: "+40721781200",
    whatsapp: "40721781200",
    street: "Str. Regina Maria, nr. 16",
    city: null,
    instagram: null,
    hours: [
      ["Monday – Friday", "10:00 – 20:00"],
      ["Saturday", "10:00 – 16:00"],
      ["Sunday", "Closed"]
    ]
  },

  home: {
    heroImage: "img/hero-home.webp",
    heroAlt: "Woman in a black blazer and pearl necklace, posing against a warm beige wall",
    heroTitle: "A place to feel good, connect and simply be.",
    servicesLead: "Three rituals, one philosophy: take your time, feel looked after, leave a little more yourself."
  },

  services: [
    {
      id: "hair",
      title: "Hair Care & Styling",
      lead: "Healthy hair, styled to feel like you.",
      image: "img/hair-1.webp",
      alt: "Woman with long, glossy dark curls",
      text: "From a precise cut to a deep-repair ritual, every appointment starts with a conversation about your hair, your routine and the way you want to feel when you walk out.",
      menu: [
        { name: "Cut & Blow-dry", text: "Consultation, wash, precision cut and a finish styled to your face and lifestyle.", price: null },
        { name: "Colour & Balayage", text: "Single-process colour, soft balayage or highlights, planned around your natural tone.", price: null },
        { name: "Repair Treatment", text: "A restorative ritual for dry, coloured or heat-stressed hair, with scalp massage.", price: null },
        { name: "Event Styling", text: "Waves, sleek looks or updos for weddings, evenings and photo shoots.", price: null }
      ]
    },
    {
      id: "nails",
      title: "Nail Art",
      lead: "Small details, done beautifully.",
      image: "img/nails-1.webp",
      alt: "Hand with long almond nails in a soft pink ombré",
      text: "Clean, long-lasting manicures and pedicures, from barely-there nudes to hand-painted designs. We take our time with cuticle care and shaping, so the result looks good for weeks.",
      menu: [
        { name: "Classic Manicure", text: "Shaping, cuticle care, hand massage and classic polish.", price: null },
        { name: "Gel Manicure", text: "Long-wear gel colour with a glossy, chip-resistant finish.", price: null },
        { name: "Extensions & Baby Boomer", text: "Gel extensions or soft ombré, shaped to your preferred length.", price: null },
        { name: "Nail Art Design", text: "Hand-painted details, chrome, French twists or a custom idea you bring in.", price: null },
        { name: "Pedicure", text: "Foot soak, care and polish or gel, in a relaxed, unhurried setting.", price: null }
      ]
    },
    {
      id: "skin",
      title: "Skin Longevity",
      lead: "Good skin is a long game.",
      image: "img/skin-1.webp",
      alt: "Portrait of a woman with radiant, glowing skin",
      text: "Facial treatments designed for the long term: a skin analysis first, then a plan that supports hydration, firmness and glow, at your own pace.",
      menu: [
        { name: "Skin Consultation", text: "An in-depth look at your skin and routine, with a personalised treatment plan.", price: null },
        { name: "Signature Facial", text: "Deep cleanse, exfoliation, mask and massage, adapted to what your skin needs that day.", price: null },
        { name: "Lifting & Firming", text: "A treatment focused on tone, contour and elasticity.", price: null },
        { name: "Hydration Ritual", text: "Intensive moisture for dull, tired or dehydrated skin.", price: null }
      ]
    }
  ],

  /* Oferte: apar pe Home, în Services și în Offers până la "until" (ora României). */
  offers: [
    {
      id: "black-friday",
      label: "Black Friday",
      title: "Black Friday. Dar pentru pielea ta.",
      summary: "The Refining Ritual: 8 ședințe de radiofrecvență și ultrasunete, cu 15% mai puțin.",
      short: "The Refining Ritual · −15% la pachetul de 8 ședințe",
      until: "2026-11-30T23:59:00+02:00",
      untilLabel: "until 30 Nov",
      image: "img/skin-1.webp",
      thumb: "img/skin-2.webp",
      steps: [
        ["Pregătire", "Curățare și aplicarea cremei speciale."],
        ["Sculptare", "Ultrasunete și radiofrecvență, personalizate pentru pielea ta."],
        ["Finisare", "Masaj facial relaxant, cu produse profesionale Mary Cohr Paris."]
      ],
      packagesTitle: "Pachete · 8 ședințe",
      packages: [
        { name: "Față", old: 2800, now: 2380, per: 298, save: 420 },
        { name: "Față + Gât", old: 3600, now: 3060, per: 383, save: 540, best: true },
        { name: "Signature", sub: "Față + Gât + Decolteu", old: 4720, now: 4012, per: 502, save: 708 }
      ],
      notes: [
        "Nu ești sigură? Începe cu o ședință: Față 350 RON · Față + Gât 450 RON · Signature 590 RON."
      ],
      validity: ["Ofertă valabilă până pe ", "30 noiembrie", " sau până la epuizarea locurilor. Se rezervă telefonic sau pe WhatsApp."],
      untilConfirmed: false,
      bookText: "Bună! Vreau să rezerv oferta de Black Friday.",
      packageText: "Bună! Vreau pachetul Black Friday: {name} (8 ședințe)."
    }
  ],

  /* Evenimente (cam unul pe lună). example: true = exemplu de format, nu eveniment real. */
  events: [
    {
      title: "MOODS Evening",
      text: "Workshops, launches and evenings together",
      when: "Event · example",
      until: "2026-12-31T23:59:00+02:00",
      example: true
    }
  ],

  /* Notificări demonstrative (până se conectează OneSignal). */
  demoPushes: [
    "Black Friday: Ritualul complet, 8 ședințe cu 15% mai puțin. Ultimele locuri!",
    "New this week: chrome & French twist nail designs. Book your slot.",
    "MOODS Evening: skin talk & prosecco, Thursday at 19:00. Save your seat."
  ]
};
