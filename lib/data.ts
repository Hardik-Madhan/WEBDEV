export type Caretaker = {
  id: string
  name: string
  photo: string
  verified: boolean
  rating: number
  reviews: number
  experience: number
  skills: string[]
  careTypes: string[]
  location: string
  distance: number
  availability: "Available Today" | "Available Now" | "Available Tomorrow" | "Booked"
  price: number
  languages: string[]
  about: string
  services: string[]
  responseTime: string
  // percentage coords for the mock map (0-100)
  map: { x: number; y: number }
}

export const careTypes = [
  "Elderly Care",
  "Patient Care",
  "Child Care",
  "Companion Care",
  "Home Assistance",
] as const

export const caretakers: Caretaker[] = [
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    photo: "/images/caretaker-1.png",
    verified: true,
    rating: 4.9,
    reviews: 126,
    experience: 8,
    skills: ["Medication", "Mobility", "Companionship", "Meal Prep"],
    careTypes: ["Elderly Care", "Patient Care"],
    location: "Koramangala, Bengaluru",
    distance: 1.4,
    availability: "Available Today",
    price: 350,
    languages: ["English", "Hindi", "Kannada"],
    about:
      "Compassionate elderly-care specialist with nearly a decade of experience supporting seniors with daily living, medication schedules, and gentle physiotherapy. I believe care is about dignity first.",
    services: ["Daily living support", "Medication reminders", "Post-surgery care", "Mobility assistance"],
    responseTime: "Usually responds in 10 min",
    map: { x: 32, y: 40 },
  },
  {
    id: "arjun-mehta",
    name: "Arjun Mehta",
    photo: "/images/caretaker-2.png",
    verified: true,
    rating: 4.8,
    reviews: 94,
    experience: 12,
    skills: ["Nursing", "Wound Care", "Physiotherapy", "Vitals"],
    careTypes: ["Patient Care", "Home Assistance"],
    location: "Indiranagar, Bengaluru",
    distance: 2.1,
    availability: "Available Now",
    price: 420,
    languages: ["English", "Hindi"],
    about:
      "Certified nursing assistant focused on post-operative and chronic-illness patient care. I keep families informed with clear daily updates and a calm, steady presence.",
    services: ["Post-operative care", "Wound dressing", "Vitals monitoring", "Injections"],
    responseTime: "Usually responds in 5 min",
    map: { x: 58, y: 28 },
  },
  {
    id: "neha-verma",
    name: "Neha Verma",
    photo: "/images/caretaker-3.png",
    verified: true,
    rating: 4.9,
    reviews: 152,
    experience: 6,
    skills: ["Newborn Care", "Play", "Nutrition", "First Aid"],
    careTypes: ["Child Care", "Companion Care"],
    location: "HSR Layout, Bengaluru",
    distance: 3.0,
    availability: "Available Today",
    price: 300,
    languages: ["English", "Hindi", "Telugu"],
    about:
      "Warm and energetic childcare professional. From newborns to school-age kids, I create safe, playful routines that give parents complete peace of mind.",
    services: ["Newborn care", "After-school care", "Meal preparation", "Activity planning"],
    responseTime: "Usually responds in 15 min",
    map: { x: 46, y: 62 },
  },
  {
    id: "lakshmi-rao",
    name: "Lakshmi Rao",
    photo: "/images/caretaker-4.png",
    verified: true,
    rating: 4.7,
    reviews: 210,
    experience: 15,
    skills: ["Dementia", "Companionship", "Meal Prep", "Mobility"],
    careTypes: ["Elderly Care", "Companion Care"],
    location: "Jayanagar, Bengaluru",
    distance: 4.2,
    availability: "Available Tomorrow",
    price: 380,
    languages: ["English", "Hindi", "Tamil", "Kannada"],
    about:
      "Fifteen years caring for seniors, with special training in dementia and Alzheimer's support. Patience and a gentle routine are at the heart of everything I do.",
    services: ["Dementia care", "Companionship", "Meal preparation", "Light housekeeping"],
    responseTime: "Usually responds in 30 min",
    map: { x: 24, y: 70 },
  },
  {
    id: "rohan-iyer",
    name: "Rohan Iyer",
    photo: "/images/caretaker-5.png",
    verified: true,
    rating: 4.8,
    reviews: 78,
    experience: 5,
    skills: ["Physiotherapy", "Mobility", "Vitals", "Companionship"],
    careTypes: ["Patient Care", "Home Assistance"],
    location: "Whitefield, Bengaluru",
    distance: 5.6,
    availability: "Available Now",
    price: 360,
    languages: ["English", "Hindi", "Malayalam"],
    about:
      "Physiotherapy-trained caregiver helping patients rebuild strength and confidence at home after injury or surgery. I make recovery feel achievable, one small win at a time.",
    services: ["Physiotherapy support", "Mobility training", "Vitals monitoring", "Recovery planning"],
    responseTime: "Usually responds in 8 min",
    map: { x: 74, y: 48 },
  },
  {
    id: "ananya-das",
    name: "Ananya Das",
    photo: "/images/caretaker-6.png",
    verified: true,
    rating: 5.0,
    reviews: 63,
    experience: 9,
    skills: ["Palliative", "Nursing", "Companionship", "Meal Prep"],
    careTypes: ["Patient Care", "Elderly Care"],
    location: "Malleshwaram, Bengaluru",
    distance: 3.8,
    availability: "Available Today",
    price: 400,
    languages: ["English", "Hindi", "Bengali"],
    about:
      "Palliative and elderly-care nurse committed to comfort, dignity, and family support during sensitive times. Families describe me as calm, reliable, and deeply kind.",
    services: ["Palliative care", "Medication management", "Companionship", "Family support"],
    responseTime: "Usually responds in 12 min",
    map: { x: 40, y: 22 },
  },
]

export const testimonials = [
  {
    name: "Meera Nair",
    photo: "/images/user-1.png",
    rating: 5,
    careType: "Elderly Care",
    quote:
      "Finding care for my mother felt overwhelming until CareSure. Within an hour I had booked Priya, and she has been an absolute blessing for our family.",
  },
  {
    name: "Sanjay Gupta",
    photo: "/images/user-2.png",
    rating: 5,
    careType: "Patient Care",
    quote:
      "After my father's surgery we needed reliable nursing at home. The verified profiles gave us confidence, and Arjun's daily updates put us completely at ease.",
  },
  {
    name: "Divya Menon",
    photo: "/images/user-3.png",
    rating: 5,
    careType: "Child Care",
    quote:
      "As working parents, trust is everything. CareSure made it simple to compare, read real reviews, and book someone wonderful for our little one.",
  },
]

export const stats = [
  { value: 5000, suffix: "+", label: "Verified Caretakers" },
  { value: 4.8, suffix: "/5", label: "Average Rating", decimals: 1 },
  { value: 25, suffix: "+", label: "Cities" },
  { value: 10000, suffix: "+", label: "Families Helped" },
]
