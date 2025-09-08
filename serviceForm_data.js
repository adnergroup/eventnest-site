// serviceForm_data.js
// This file contains all the data for the Event Organizer Service Request form.

const eventLocations = [
    "Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Queenstown", "Other"
];

const eventTypes = [
    "Wedding", "Corporate Event", "Private Party", "Birthday", "Conference", "Other"
];

const serviceCategories = [
    "Catering", "Photography", "Decorations", "AV", "Transport", "Cleaning", "Other"
];

const budgetRanges = [
    "Under $1,000", "$1,000 - $2,500", "$2,500 - $5,000", "Over $5,000", "Flexible"
];

const subCategoryOptions = {
    catering: ["Full-service Catering", "Food Trucks", "Grazing Tables", "Beverage/Bartenders"],
    photography: ["Event Photography", "Event Videography", "Photo Booth", "Drone Footage"],
    decorations: ["Floral Arrangements", "Lighting Design", "Full Event Theming"],
    av: ["Sound System", "Projection", "Lighting", "Full AV Package"],
    transport: ["Guest Shuttle", "Equipment Transport", "VIP Transport"],
    cleaning: ["Pre-Event Cleaning", "Post-Event Cleaning", "Waste Management"]
};