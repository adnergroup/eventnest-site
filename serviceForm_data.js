// serviceForm_data.js

// Reusing serviceSubtypesData from eventForm_data.js for consistency
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

// Form step configuration for Service Provider Registration
const providerFormStepsConfig = [
    { id: 'step-1', label: 'Business Information' },
    { id: 'step-2', label: 'Service Categories' },
    { id: 'step-3', label: 'Service Details' },
    { id: 'step-4', label: 'Business Contact Information' },
    { id: 'step-5', label: 'Review & Submit' }
];

// Business Type options
const businessTypes = [
    { value: "sole-trader", text: "Sole Trader", selected: true },
    { value: "partnership", text: "Partnership" },
    { value: "limited-company", text: "Limited Company" },
    { value: "trust", text: "Trust" },
    { value: "non-profit", text: "Non-Profit Organization" },
    { value: "other", text: "Other" }
];

// Years in Operation options
const yearsOperating = [
    { value: "", text: "Select years in operation", disabled: true, selected: true },
    { value: "less-than-1", text: "Less than 1 year" },
    { value: "1-3", text: "1-3 years" },
    { value: "4-7", text: "4-7 years" },
    { value: "8-15", text: "8-15 years" },
    { value: "more-than-15", text: "More than 15 years" }
];

// Service Categories for provider registration (matching serviceSubtypesData keys)
const providerServiceCategories = [
    { value: "Catering", text: "Catering & Food Services", icon: "🍽️" },
    { value: "Photography", text: "Photography & Videography", icon: "📸" },
    { value: "Decorations", text: "Stage & Party Decorations", icon: "🎭" },
    { value: "AV", text: "Audio Video/Technical Services", icon: "🎵" },
    { value: "Transport", text: "Transport & Logistics Support", icon: "🚐" },
    { value: "Cleaning", text: "Cleaning & Waste Management", icon: "🧹" },
    { value: "Kids", text: "Kids' Entertainment", icon: "🧒" },
    { value: "Cultural", text: "Māori & Pasifika Cultural Services", icon: "🏞️" },
    { value: "Other", text: "Other Service", icon: "✨" }
];

// Common service details options (e.g., for price range, lead time)
const priceRanges = [
    { value: "", text: "Select typical price range", disabled: true, selected: true },
    { value: "budget", text: "Budget-Friendly (Under $500)" },
    { value: "mid-range", text: "Mid-Range ($500–$2,000)" },
    { value: "premium", text: "Premium ($2,000–$5,000)" },
    { value: "luxury", text: "Luxury ($5,000+)" },
    { value: "varies", text: "Varies Widely (Quote-Based)" }
];

const leadTimes = [
    { value: "", text: "Select typical lead time", disabled: true, selected: true },
    { value: "last-minute", text: "Last Minute (1-7 days)" },
    { value: "short", text: "Short Notice (1-2 weeks)" },
    { value: "standard", text: "Standard (3-4 weeks)" },
    { value: "extended", text: "Extended (1-3 months)" },
    { value: "long", text: "Long Term (3+ months)" }
];

// Location options (updated with districts from Trade Me)
const locations = [
    { value: "Wellington", text: "Wellington" },
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

// Specific sub-service options for each category, used for dynamic population in step 3
const specificServiceOptions = {
    "Catering": {
        "Cuisine Types": [
            "Modern New Zealand Cuisine", "Māori Cuisine", "Pasifika Cuisine", "Italian Cuisine",
            "French Cuisine", "Greek Cuisine", "Mediterranean Cuisine", "Chinese Cuisine",
            "Japanese Cuisine", "Thai Cuisine", "Korean Cuisine", "Middle Eastern Cuisine",
            "South American Cuisine", "Indian Cuisine", "North Indian Cuisine", "South Indian Cuisine",
            "Indian Sweets & Desserts", "Punjabi Cuisine (Indian)", "Hyderabadi Cuisine (Indian)",
            "Vegetarian & Vegan", "Health & Organic"
        ],
        "Services Offered": [
            "Buffet Service", "Plated Service", "Canapés & Finger Food", "Food Stalls/Stations",
            "Beverage Service", "Waiting Staff"
        ]
    },
    "Photography": {
        "Services Offered": [
            "Event Photography", "Portrait Photography", "Product Photography", "Aerial/Drone Photography",
            "Event Videography", "Promotional Videos", "Video Editing"
        ],
        "Photography Styles": [
            "Traditional & Classic", "Documentary & Candid", "Artistic & Creative",
            "Commercial & Corporate"
        ]
    },
    "Decorations": {
        "Decoration Styles": [
            "Elegant & Sophisticated", "Rustic & Natural", "Modern & Minimalist",
            "Themed Decorations", "Cultural & Traditional"
        ]
    },
    "AV": {
        "AV Requirements": [
            "Sound System Only", "Projection Equipment", "Lighting Setup", "Full AV Package"
        ]
    },
    "Transport": {
        "Transport Types": [
            "Guest Shuttle Service", "Equipment Transport", "VIP Transportation"
        ]
    },
    "Cleaning": {
        "Cleaning Services": [
            "Pre-Event Cleaning", "Post-Event Cleaning", "Waste Management", "Full Service (Pre, During & Post)"
        ]
    },
    "Kids": {
        "Kids Entertainment Options": [
            "Face Painting", "Games & Activities", "Performers (Clowns, Magicians, etc.)",
            "Inflatables & Play Equipment"
        ]
    },
    "Cultural": {
        "Cultural Service Types": [
            "Pōwhiri (Māori Welcome Ceremony)", "Kapa Haka Performance",
            "Pacific Island Dance Performance", "Cultural Advisor/MC"
        ]
    }
};

// Expose data to the global window object for serviceForm_logic.js
window.serviceSubtypesData = serviceSubtypesData;
window.providerFormStepsConfig = providerFormStepsConfig;
window.businessTypes = businessTypes;
window.yearsOperating = yearsOperating;
window.providerServiceCategories = providerServiceCategories;
window.priceRanges = priceRanges;
window.leadTimes = leadTimes;
window.locations = locations;
window.specificServiceOptions = specificServiceOptions;