const colognes = [
    { name: "Acqua di Parma Colonia", scent_type: "Citrus", scent_desc: "A balanced citrus fragrance suitable for any scenario.", brand: "Acqua di Parma" },
    { name: "Cremo Spice & Black Vanilla", scent_type: "Warm & Spicy", scent_desc: "A warm, spicy, and long-lasting scent.", brand: "Cremo" },
    { name: "Dolce & Gabbana Light Blue", scent_type: "Fresh", scent_desc: "A fresh and clean fragrance with a hint of citrus.", brand: "Dolce & Gabbana" },
    { name: "Tom Ford Oud Wood", scent_type: "Woody", scent_desc: "A rich and exotic woody fragrance with a hint of oud.", brand: "Tom Ford" },
    { name: "Versace Eros", scent_type: "Sweet", scent_desc: "A sweet and seductive fragrance with a hint of vanilla.", brand: "Versace" },
    { name: "Chanel Bleu de Chanel", scent_type: "Woody & Citrusy", scent_desc: "A blend of citrus and woodsy notes, making it a standout classic.", brand: "Chanel" },
    { name: "Dior Sauvage Elixir", scent_type: "Complex & Spicy", scent_desc: "A spicier version of the original, fitting for special occasions.", brand: "Dior" },
    { name: "Hermès Terre d'Hermès", scent_type: "Woody & Earthy", scent_desc: "A woody and earthy fragrance with notes of grapefruit and vetiver.", brand: "Hermès" },
    { name: "Jo Malone London Earl Grey & Cucumber", scent_type: "Fresh & Unisex", scent_desc: "A fresh, British-inspired unisex scent.", brand: "Jo Malone London" },
    { name: "Gucci Guilty Pour Homme", scent_type: "Spicy", scent_desc: "A spicy scent with notes of chili pepper and fresh rose.", brand: "Gucci" },
    { name: "Ralph Lauren Polo Red", scent_type: "Bold & Spicy", scent_desc: "Bold and spicy, perfect for evening wear.", brand: "Ralph Lauren" },
    { name: "Calvin Klein CK One", scent_type: "Fresh & Citrus", scent_desc: "A fresh and citrusy scent with notes of pineapple and green tea.", brand: "Calvin Klein" },
    { name: "Coach for Men", scent_type: "Aromatic & Woody", scent_desc: "An aromatic and woody fragrance with notes of pear and ambergris.", brand: "Coach" },
    { name: "Armani Code", scent_type: "Elegant & Sophisticated", scent_desc: "Elegant and sophisticated with a touch of tonka bean.", brand: "Armani" },
    { name: "Paco Rabanne 1 Million", scent_type: "Rich & Leathery", scent_desc: "Rich, leathery fragrance recommended for young men.", brand: "Paco Rabanne" },
    { name: "Maison Margiela 'Replica' Jazz Club", scent_type: "Earthy & Sweet", scent_desc: "Captures the essence of fall with its earthy, sweet notes.", brand: "Maison Margiela" },
    { name: "Creed Aventus", scent_type: "Fruity & Woody", scent_desc: "Balanced fruity and woody notes with impressive longevity.", brand: "Creed" },
    { name: "Issey Miyake L'Eau d'Issey Pour Homme", scent_type: "Bright & Citrusy", scent_desc: "Bright citrus and floral notes, ideal for summer.", brand: "Issey Miyake" },
    { name: "D.S. & Durga I Don't Know What", scent_type: "Subtle & Clean", scent_desc: "Unique pheromone-enhancing qualities with a subtle, clean aroma.", brand: "D.S. & Durga" },
    { name: "Yves Saint Laurent La Nuit de l'Homme", scent_type: "Spicy & Smooth", scent_desc: "Spicy and smooth, ideal for evening wear.", brand: "Yves Saint Laurent" },
    { name: "Prada Luna Rossa", scent_type: "Crisp & Clean", scent_desc: "A sporty scent with notes of lavender and orange.", brand: "Prada" },
    { name: "Bvlgari Man Wood Essence", scent_type: "Earthy", scent_desc: "A fragrance inspired by nature, with green and woody tones.", brand: "Bvlgari" },
    { name: "Givenchy Gentleman", scent_type: "Warm & Spicy", scent_desc: "A luxurious scent with notes of cinnamon and vanilla.", brand: "Givenchy" },
    { name: "Montblanc Explorer", scent_type: "Bold & Adventurous", scent_desc: "A strong, masculine scent for explorers.", brand: "Montblanc" }
];

const retailers = [
    "Sephora", "Ulta Beauty", "Macy's", "Nordstrom", "Bloomingdale's",
    "Saks Fifth Avenue", "Neiman Marcus", "Dillard's", "FragranceX", "FragranceNet",
    "The Perfume Shop", "Perfumania", "Amazon", "Walmart", "Target",
    "Walgreens", "CVS", "Rite Aid", "Beauty Encounter", "Overstock",
    "Zara", "H&M", "Harrods", "Selfridges", "Carrefour", "Woolworths",
    "Costco", "Sam's Club", "Ross Stores", "TJ Maxx"
];

const customers = [
    { name: "Emily Thompson", email: "emily.thompson@gmail.com" },
    { name: "Michael Chen", email: "michael.chen@yahoo.com" },
    { name: "Sophia Martinez", email: "sophia.martinez@gmail.com" },
    { name: "James O'Connor", email: "james.oconnor@yahoo.com" },
    { name: "Ava Johnson", email: "ava.johnson@gmail.com" },
    { name: "Ethan Brown", email: "ethan.brown@yahoo.com" },
    { name: "Olivia Davis", email: "olivia.davis@gmail.com" },
    { name: "Noah Miller", email: "noah.miller@yahoo.com" },
    { name: "Isabella Wilson", email: "isabella.wilson@gmail.com" },
    { name: "Liam Anderson", email: "liam.anderson@yahoo.com" },
    { name: "Emma Thomas", email: "emma.thomas@gmail.com" },
    { name: "Lily Moore", email: "lily.moore@gmail.com" },
    { name: "Jackson Lee", email: "jackson.lee@yahoo.com" },
    { name: "Charlotte Perez", email: "charlotte.perez@gmail.com" },
    { name: "Mason Harris", email: "mason.harris@yahoo.com" },
];

const locations = [
    'USA',
    'Canada',
    'UK',
    'Australia',
    'France',
    'Germany',
    'Italy',
    'Spain',
];

const reviews = [
    // 1-Star Reviews
    "Smells terrible, not what I expected.", 
    "Way too overpowering and strong.", 
    "Gave me a headache after wearing it for just an hour.", 
    "Does not last at all, fades within minutes.", 
    "Disappointed, smells cheap and synthetic.",

    // 2-Star Reviews
    "Too strong and not to my taste.", 
    "Fades quickly, not worth the price.", 
    "Smells okay, but nothing special.", 
    "Overpriced for what it offers.", 
    "A bit too sweet for my liking.",

    // 3-Star Reviews
    "It’s fine, but I wouldn’t buy it again.", 
    "Smells nice, but doesn’t last long.", 
    "Average scent, nothing remarkable.", 
    "Good for the price, but there are better options.", 
    "Smells decent, but feels generic.",

    // 4-Star Reviews
    "Very nice scent, but a bit expensive.", 
    "Lasts a decent amount of time.", 
    "Fresh and versatile, good for daily use.", 
    "Gets compliments, but could be stronger.", 
    "Great for the price, but not the best I’ve tried.",

    // 5-Star Reviews
    "Absolutely love it, my new favorite.", 
    "Perfect for special occasions.", 
    "Lasts all day and smells amazing.", 
    "Always gets compliments when I wear it.", 
    "Elegant, long-lasting, and worth every penny.",
    "Fantastic scent, I get asked about it all the time."
];

const carriers = [
    "FedEx", "UPS", "USPS", "DHL Express", "Aramex", "Blue Dart", 
    "Canada Post", "Royal Mail", "Hermes (Evri)", "DPD Group",
    "OnTrac", "Lasership", "Purolator", "Australia Post", 
    "SF Express", "PostNL", "Deutsche Post/DHL", "China Post", 
    "TNT", "CouriersPlease", "Delhivery", "Lalamove", "Shiprocket",
    "Fastway", "ParcelForce", "GLS", "Yodel"
];


const preferences = [
    'Citrus', 'Warm & Spicy', 'Fresh', 'Woody', 'Sweet', 'Woody & Citrusy',
    'Complex & Spicy', 'Woody & Earthy', 'Fresh & Unisex', 'Spicy', 'Bold & Spicy',
    'Fresh & Citrus', 'Aromatic & Woody', 'Elegant & Sophisticated', 'Rich & Leathery',
    'Earthy & Sweet', 'Fruity & Woody', 'Bright & Citrusy', 'Subtle & Clean', 'Spicy & Smooth',
    'Sporty', 'Classic', 'Sophisticated', 'Modern', 'Exotic'
];


module.exports = { colognes, retailers, customers, locations, reviews, carriers, preferences }