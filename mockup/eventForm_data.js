// eventForm_data.js

const serviceSubtypesData = {
    "Catering": {
        title: "Catering & Food Services",
        subcategories: {
            "Service Types": [
                "Full-service Catering (plated/buffet)",
                "Food Trucks & Mobile Kitchens",
                "Grazing Tables & Platters",
                "Dessert Bars / Ice Cream Carts",
                "Beverage Services / Bartenders",
                "Alcohol Licensing & Management",
                "Coffee Carts & Mobile Baristas",
                "Catering Equipment Hire (cutlery, crockery, linen)"
            ],
            "Cuisine Types": [
                "Modern New Zealand Cuisine",
                "Māori Cuisine",
                "Pasifika Cuisine",
                "Italian Cuisine",
                "French Cuisine",
                "Greek Cuisine",
                "Mediterranean Cuisine",
                "Chinese Cuisine",
                "Japanese Cuisine",
                "Thai Cuisine",
                "Korean Cuisine",
                "Middle Eastern Cuisine",
                "South American Cuisine",
                "Indian Cuisine",
                "North Indian Cuisine",
                "South Indian Cuisine",
                "Indian Sweets & Desserts",
                "Punjabi Cuisine (Indian)",
                "Hyderabadi Cuisine (Indian)",
                "Vegetarian & Vegan",
                "Health & Organic"
            ]
        }
    },
    "Photography": {
        title: "Photography & Videography",
        subcategories: {
            "Photography Styles": [
                "Traditional & Classic",
                "Documentary & Candid",
                "Artistic & Creative",
                "Aerial & Drone Photography",
                "Portrait Focus",
                "Other"
            ]
        }
    },
    "Decorations": {
        title: "Stage & Party Decorations",
        subcategories: {
            "Decoration Styles": [
                "Elegant & Sophisticated",
                "Rustic & Natural",
                "Modern & Minimalist",
                "Themed Decorations",
                "Cultural & Traditional",
                "Other"
            ]
        }
    },
    "AV": {
        title: "Audio Video/Technical Services",
        subcategories: {
            "AV Requirements": [
                "Sound System Only",
                "Projection Equipment",
                "Lighting Setup",
                "Full AV Package",
                "Other"
            ]
        }
    },
    "Transport": {
        title: "Transport & Logistics Support",
        subcategories: {
            "Transport Types": [
                "Guest Shuttle Service",
                "Equipment Transport",
                "VIP Transportation",
                "Other"
            ]
        }
    },
    "Cleaning": {
        title: "Cleaning & Waste Management",
        subcategories: {
            "Cleaning Services": [
                "Pre-Event Cleaning",
                "Post-Event Cleaning",
                "Waste Management",
                "Full Service (Pre, During & Post)",
                "Other"
            ]
        }
    },
    "Kids": {
        title: "Kids' Entertainment",
        subcategories: {
            "Kids Entertainment Options": [
                "Face Painting",
                "Games & Activities",
                "Performers (Clowns, Magicians, etc.)",
                "Inflatables & Play Equipment",
                "Other"
            ]
        }
    },
    "Cultural": {
        title: "Māori & Pasifika Cultural Services",
        subcategories: {
            "Cultural Service Types": [
                "Pōwhiri (Māori Welcome Ceremony)",
                "Kapa Haka Performance",
                "Pacific Island Dance Performance",
                "Cultural Advisor/MC",
                "Other"
            ]
        }
    },
    "Other": {
        title: "Other Service",
        subcategories: {} // No predefined subcategories, uses a textarea
    }
};

// Form step configuration
const formStepsConfig = [
    { id: 'step-1', label: 'Event Overview & Services' },
    { id: 'step-2', label: 'Budgeting' },
    { id: 'step-3', label: 'Service Delivery' },
    { id: 'step-4', label: 'Additional Event Details' },
    { id: 'step-5', label: 'Organiser Information' },
    { id: 'step-6', label: 'Review & Submit' }
];

// Location options (updated with districts, "Other" removed)
const locations = [
    { value: "Wellington", text: "Wellington" }, // Default selected
    { value: "Northland", text: "Northland" },
    { value: "Auckland", text: "Auckland" },
    { value: "Waikato", text: "Waikato" },
    { value: "Bay Of Plenty", text: "Bay Of Plenty" },
    { value: "Gisborne", text: "Gisborne" },
    { value: "Hawke's Bay", text: "Hawke's Bay" },
    { value: "Taranaki", text: "Taranaki" },
    { value: "Manawatu / Whanganui", text: "Manawatu / Whanganui" },
    { value: "Nelson / Tasman", text: "Nelson / Tasman" },
    { value: "Marlborough", text: "Marlborough" },
    { value: "West Coast", text: "West Coast" },
    { value: "Canterbury", text: "Canterbury" },
    { value: "Otago", text: "Otago" },
    { value: "Southland", text: "Southland" }
];

// Event Type options (updated with more common NZ event types, Birthday Celebration as default)
const eventTypes = [
    { value: "Birthday Celebration", text: "Birthday Celebration" }, // Set as default
    { value: "Wedding", text: "Wedding" },
    { value: "Corporate Event", text: "Corporate Event" },
    { value: "Anniversary Celebration", text: "Anniversary Celebration" },
    { value: "Graduation Party", text: "Graduation Party" },
    { value: "Hens Party", text: "Hens Party" },
    { value: "Stag Party", text: "Stag Party" },
    { value: "Baby Shower", text: "Baby Shower" },
    { value: "Engagement Party", text: "Engagement Party" },
    { value: "Cultural Festival", text: "Cultural Festival" },
    { value: "Marae Event", text: "Marae Event" },
    { value: "Community Gathering", text: "Community Gathering" },
    { value: "Charity Gala", text: "Charity Gala" },
    { value: "Product Launch", text: "Product Launch" },
    { value: "Conference / Seminar", text: "Conference / Seminar" },
    { value: "Workshop", text: "Workshop" },
    { value: "Sports Event", text: "Sports Event" },
    { value: "Concert / Live Show", text: "Concert / Live Show" },
    { value: "Market / Expo", text: "Market / Expo" },
    { value: "Private Dinner Party", text: "Private Dinner Party" },
    { value: "Funeral / Memorial Service", text: "Funeral / Memorial Service" },
    { value: "Other", text: "Other" }
];

// Budget Range options
const budgetRanges = [
    { value: "", text: "Select your budget range", disabled: true, selected: true },
    { value: "under-500", text: "Under $500" },
    { value: "500-1000", text: "$500–$1,000" },
    { value: "1000-2000", text: "$1,000–$2,000" },
    { value: "2000-5000", text: "$2,000–$5,000" },
    { value: "5000-plus", text: "$5,000+" }
];

// Service Category options (already in serviceSubtypesData, but can be explicitly listed for dropdown)
const serviceCategories = [
    { value: "Catering", text: "Catering & Food Services" },
    { value: "Photography", text: "Photography & Videography" },
    { value: "Decorations", text: "Stage & Party Decorations" },
    { value: "AV", text: "Audio Video/Technical Services" },
    { value: "Transport", text: "Transport & Logistics Support" },
    { value: "Cleaning", text: "Cleaning & Waste Management" },
    { value: "Kids", text: "Kids' Entertainment" },
    { value: "Cultural", text: "Māori & Pasifika Cultural Services" },
    { value: "Other", text: "Other" }
];
