

const crystals = [
  {
    item_id: 1,
    type: "necklace",
    color: "purple",
    price: 180,
    Material: "amethyst crystal",
    usage: "calming energy, inner peace, spiritual development",
    associated_zodiac_signs: ["Pisces", "Virgo", "Aquarius", "Capricorn"],
    Image_url: "https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL2NyeXN0YWxzLTIuanBnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo4Mjh9LCJ0b0Zvcm1hdCI6ImF2aWYifX0=",
    Arrival_time: new Date("2025-01-10T10:00:00.000Z")
  },
  {
    item_id: 2,
    type: "bracelet",
    color: "green",
    price: 150,
    Material: "green aventurine",
    usage: "luck, abundance, emotional balance",
    associated_zodiac_signs: ["Taurus", "Aries", "Leo"],
    Image_url: "https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL2NyeXN0YWxzLTMuanBnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo4Mjh9LCJ0b0Zvcm1hdCI6ImF2aWYifX0=",
    Arrival_time: new Date("2025-01-15T12:00:00.000Z")
  },
  {
    item_id: 3,
    type: "necklace",
    color: "blue",
    price: 190,
    Material: "lapis lazuli",
    usage: "communication, intuition, inner strength",
    associated_zodiac_signs: ["Sagittarius", "Libra"],
    Image_url: "https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL2NyeXN0YWxzLTQuanBnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo4Mjh9LCJ0b0Zvcm1hdCI6ImF2aWYifX0=",
    Arrival_time: new Date("2025-01-20T11:30:00.000Z")
  },
  {
    item_id: 4,
    type: "bracelet",
    color: "amber",
    price: 160,
    Material: "tiger's eye",
    usage: "courage, self-esteem, confidence",
    associated_zodiac_signs: ["Capricorn", "Leo"],
    Image_url: "https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL2NyeXN0YWxzLTUuanBnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo4Mjh9LCJ0b0Zvcm1hdCI6ImF2aWYifX0=",
    Arrival_time: new Date("2025-01-25T09:45:00.000Z")
  },
  {
    item_id: 5,
    type: "bracelet",
    color: "pink",
    price: 140,
    Material: "rose quartz",
    usage: "love, compassion, emotional healing",
    associated_zodiac_signs: ["Taurus", "Libra"],
    Image_url: "https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL2NyeXN0YWxzLTYuanBnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo4Mjh9LCJ0b0Zvcm1hdCI6ImF2aWYifX0=",
    Arrival_time: new Date("2025-01-30T14:00:00.000Z")
  },
  {
    item_id: 6,
    type: "pendant",
    color: "clear",
    price: 170,
    Material: "clear quartz",
    usage: "amplification, clarity, spiritual growth",
    associated_zodiac_signs: ["All signs"],
    Image_url: "https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL2NyeXN0YWxzLTcuanBnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo4Mjh9LCJ0b0Zvcm1hdCI6ImF2aWYifX0=",
    Arrival_time: new Date("2025-02-01T16:00:00.000Z")
  },
  {
    item_id: 7,
    type: "ring",
    color: "iridescent",
    price: 200,
    Material: "labradorite",
    usage: "psychic abilities, insight, clarity",
    associated_zodiac_signs: ["Scorpio", "Leo"],
    Image_url: "https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL2NyeXN0YWxzLTguanBnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo4Mjh9LCJ0b0Zvcm1hdCI6ImF2aWYifX0=",
    Arrival_time: new Date("2025-02-03T10:30:00.000Z")
  },
  {
    item_id: 8,
    type: "bracelet",
    color: "gold",
    price: 130,
    Material: "citrine",
    usage: "positivity, confidence, success",
    associated_zodiac_signs: ["Gemini", "Leo"],
    Image_url: "https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL2NyeXN0YWxzLTkuanBnIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo4Mjh9LCJ0b0Zvcm1hdCI6ImF2aWYifX0=",
    Arrival_time: new Date("2025-02-05T11:00:00.000Z")
  },
  {
    item_id: 9,
    type: "necklace",
    color: "emerald",
    price: 165,
    Material: "malachite",
    usage: "personal growth, emotional healing, transformation",
    associated_zodiac_signs: ["Scorpio", "Capricorn"],
    Image_url: "https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL2NyeXN0YWxzLTEwLmpwZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6ODI4fSwidG9Gb3JtYXQiOiJhdmlmIn19",
    Arrival_time: new Date("2025-02-07T13:00:00.000Z")
  },
  {
    item_id: 10,
    type: "pendant",
    color: "white",
    price: 145,
    Material: "selenite",
    usage: "cleansing, purification, meditation",
    associated_zodiac_signs: ["Taurus", "Cancer"],
    Image_url: "https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL2NyeXN0YWxzLTExLmpwZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6ODI4fSwidG9Gb3JtYXQiOiJhdmlmIn19",
    Arrival_time: new Date("2025-02-10T08:00:00.000Z")
  },
  {
    item_id: 11,
    type: "ring",
    color: "black",
    price: 120,
    Material: "black tourmaline",
    usage: "protection, purification, stability",
    associated_zodiac_signs: ["Capricorn", "Scorpio"],
    Image_url: "https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL2NyeXN0YWxzLTEyLmpwZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6ODI4fSwidG9Gb3JtYXQiOiJhdmlmIn19",
    Arrival_time: new Date("2025-02-11T15:30:00.000Z")
  },
  {
    item_id: 12,
    type: "bracelet",
    color: "red",
    price: 150,
    Material: "carnelian",
    usage: "vitality, courage, creativity",
    associated_zodiac_signs: ["Aries", "Leo"],
    Image_url: "https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL2NyeXN0YWxzLTEzLmpwZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6ODI4fSwidG9Gb3JtYXQiOiJhdmlmIn19",
    Arrival_time: new Date("2025-02-12T10:00:00.000Z")
  }
];