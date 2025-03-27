// יצירת מסד נתונים "travel"
use("travel");

// יצירת אוסף ריק
db.createCollection("attractions");

// הוספת מסמכים לאוסף "attractions"
use("travel");
db.attractions.insertMany(
    [
        {
            city: "Amsterdam",
            attractions: [
                "Rijksmuseum",
                "Van Gogh Museum",
                "Anne Frank House",
                "Vondelpark",
                "Dam Square",
                "De Bijenkorf",
                "Kalvertoren"
            ]
        },
        {
            city: "Barcelona",
            attractions: [
                "Sagrada Familia",
                "Park Güell",
                "La Rambla",
                "Casa Batlló",
                "Gothic Quarter",
                "La Maquinista",
                "Maremagnum"
            ]
        },
        {
            city: "Berlin",
            attractions: [
                "Brandenburg Gate",
                "Berlin Wall Memorial",
                "Reichstag Building",
                "Museum Island",
                "Berlin Cathedral",
                "KaDeWe",
                "Mall of Berlin"
            ]
        },
        {
            city: "Dubai",
            attractions: [
                "Burj Khalifa",
                "Palm Jumeirah",
                "Dubai Mall",
                "Dubai Fountain",
                "Burj Al Arab",
                "Ibn Battuta Mall",
                "Mall of the Emirates"
            ]
        },
        {
            city: "London",
            attractions: [
                "Big Ben",
                "Tower of London",
                "London Eye",
                "Buckingham Palace",
                "British Museum",
                "Harrods",
                "Westfield London"
            ]
        },
        {
            city: "Los Angeles",
            attractions: [
                "Hollywood Sign",
                "Griffith Observatory",
                "The Getty Center",
                "Santa Monica Pier",
                "Universal Studios Hollywood",
                "The Grove",
                "Rodeo Drive"
            ]
        },
        {
            city: "New York",
            attractions: [
                "Statue of Liberty",
                "Central Park",
                "Empire State Building",
                "Times Square",
                "Broadway",
                "Metropolitan Museum of Art",
                "Brooklyn Bridge"
            ]
        },
        {
            city: "Paris",
            attractions: [
                "Eiffel Tower",
                "Louvre Museum",
                "Notre-Dame Cathedral",
                "Sacré-Cœur Basilica",
                "Champs-Élysées",
                "Montmartre",
                "Versailles Palace"
            ]
        },
        {
            city: "Rome",
            attractions: [
                "Colosseum",
                "Pantheon",
                "Trevi Fountain",
                "Vatican Museums",
                "St. Peter's Basilica",
                "Piazza Navona",
                "Spanish Steps"
            ]
        },
        {
            city: "San Francisco",
            attractions: [
                "Golden Gate Bridge",
                "Alcatraz Island",
                "Fisherman's Wharf",
                "Pier 39",
                "Lombard Street",
                "Chinatown",
                "Palace of Fine Arts"
            ]
        },
        {
            city: "Seoul",
            attractions: [
                "Gyeongbokgung Palace",
                "N Seoul Tower",
                "Bukchon Hanok Village",
                "Myeongdong Shopping Street",
                "Dongdaemun Design Plaza",
                "Lotte World",
                "Insadong"
            ]
        },
        {
            city: "Madrid",
            attractions: [
                "Prado Museum",
                "Royal Palace of Madrid",
                "Retiro Park",
                "Puerta del Sol",
                "Plaza Mayor",
                "Temple of Debod",
                "Gran Vía"
            ]
        },
        {
            city: "Tokyo",
            attractions: [
                "Shibuya Crossing",
                "Senso-ji Temple",
                "Tokyo Tower",
                "Meiji Shrine",
                "Shinjuku Gyoen National Garden",
                "Odaiba",
                "Tokyo Disneyland"
            ]
        }
    ]
);

// הצגת כל הנתונים
use("travel");
db.attractions.find();

// הצגת שמות הערים בלבד
use("travel");
db.attractions.find({}, { city: 1, _id: 0 });

// חיפוש אטרקציות בעיר מסוימת
use("travel");
db.attractions.find({ "city": "Paris" }, { _id: 0 });







// יצירת מסד נתונים "travel"
use("travel");

// יצירת אוסף ערים (cities)
db.createCollection("cities");

// הוספת מסמכים לאוסף "cities"
use("travel");
db.cities.insertMany(
    [
        { city: "Paris" },
        { city: "London" },
        { city: "New York" },
        { city: "Tokyo" },
        { city: "Rome" },
        { city: "Los Angeles" },
        { city: "Berlin" },
        { city: "Barcelona" },
        { city: "Dubai" },
        { city: "Amsterdam" },
        { city: "San Francisco" },
        { city: "Madrid" },
        { city: "Seoul" }
    ]
);

// הצגת כל הנתונים
use("travel");
db.cities.find();

// הצגת רק שמות הערים
use("travel");
db.cities.find({}, { city: 1, _id: 0 });




// יצירת מסד נתונים "flights"
use("travel");

// יצירת אוסף טיסות (flights)
db.createCollection("flights");

// הוספת נתונים על טיסות
use("travel");
db.flights.insertMany(
    [
        {
            city: "Paris",
            airlines: [
                { name: "Air France", price: 600, duration: "10h 30m" },
                { name: "Delta Airlines", price: 650, duration: "10h 45m" },
                { name: "Emirates", price: 700, duration: "11h 00m" }
            ]
        },
        {
            city: "London",
            airlines: [
                { name: "British Airways", price: 550, duration: "8h 00m" },
                { name: "American Airlines", price: 600, duration: "8h 15m" },
                { name: "Lufthansa", price: 650, duration: "8h 30m" }
            ]
        },
        {
            city: "New York",
            airlines: [
                { name: "American Airlines", price: 700, duration: "12h 00m" },
                { name: "Delta Airlines", price: 750, duration: "12h 30m" },
                { name: "United Airlines", price: 800, duration: "13h 00m" }
            ]
        },
        {
            city: "Tokyo",
            airlines: [
                { name: "Japan Airlines", price: 800, duration: "14h 00m" },
                { name: "All Nippon Airways", price: 850, duration: "14h 15m" },
                { name: "United Airlines", price: 900, duration: "14h 30m" }
            ]
        },
        {
            city: "Rome",
            airlines: [
                { name: "Alitalia", price: 600, duration: "7h 00m" },
                { name: "Delta Airlines", price: 650, duration: "7h 15m" },
                { name: "KLM", price: 700, duration: "7h 30m" }
            ]
        },
        {
            city: "Los Angeles",
            airlines: [
                { name: "American Airlines", price: 650, duration: "14h 30m" },
                { name: "Delta Airlines", price: 700, duration: "15h 00m" },
                { name: "Lufthansa", price: 750, duration: "15h 15m" }
            ]
        },
        {
            city: "Berlin",
            airlines: [
                { name: "Lufthansa", price: 550, duration: "9h 00m" },
                { name: "Air France", price: 600, duration: "9h 15m" },
                { name: "United Airlines", price: 650, duration: "9h 30m" }
            ]
        },
        {
            city: "Barcelona",
            airlines: [
                { name: "Vueling", price: 300, duration: "2h 30m" },
                { name: "Iberia", price: 350, duration: "2h 45m" },
                { name: "Ryanair", price: 400, duration: "3h 00m" }
            ]
        },
        {
            city: "Dubai",
            airlines: [
                { name: "Emirates", price: 800, duration: "3h 30m" },
                { name: "Flydubai", price: 850, duration: "3h 45m" },
                { name: "Etihad Airways", price: 900, duration: "4h 00m" }
            ]
        },
        {
            city: "Amsterdam",
            airlines: [
                { name: "KLM", price: 550, duration: "8h 45m" },
                { name: "Delta Airlines", price: 600, duration: "9h 00m" },
                { name: "Lufthansa", price: 650, duration: "9h 15m" }
            ]
        },
        {
            city: "San Francisco",
            airlines: [
                { name: "United Airlines", price: 550, duration: "11h 30m" },
                { name: "Delta Airlines", price: 620, duration: "12h 10m" },
                { name: "American Airlines", price: 580, duration: "11h 50m" }
            ]
        },
        {
            city: "Madrid",
            airlines: [
                { name: "United Airlines", price: 550, duration: "11h 30m" },
                { name: "Delta Airlines", price: 620, duration: "12h 10m" },
                { name: "American Airlines", price: 580, duration: "11h 50m" }
            ]
        },
        {
            city: "Seoul",
            airlines: [
                { name: "Korean Air", price: 700, duration: "14h 20m" },
                { name: "Asiana Airlines", price: 680, duration: "14h 5m" },
                { name: "Delta Airlines", price: 720, duration: "14h 40m" }
            ]
        }
    ]
);

// הצגת כל הנתונים
use("travel");
db.flights.find();

// הצגת רק שמות הערים ופרטי הטיסות
use("travel");
db.flights.find({}, { city: 1, airlines: 1, _id: 0 });








// יצירת מסד נתונים "hotels"
use("travel");

// יצירת אוסף מלונות (hotels)
db.createCollection("hotels");

// הוספת נתונים על מלונות
use("travel");
db.hotels.insertMany(
    [
        {
            city: "Paris",
            hotels: [
                { name: "Le Meurice", price: 2800 },
                { name: "The Ritz Paris", price: 3200 },
                { name: "Shangri-La Hotel Paris", price: 2900 },
                { name: "Four Seasons Hotel George V", price: 3100 },
                { name: "Hôtel Plaza Athénée", price: 3000 },
                { name: "Mandarin Oriental Paris", price: 2700 }
            ]
        },
        {
            city: "London",
            hotels: [
                { name: "The Ritz London", price: 3000 },
                { name: "Claridge's", price: 2800 },
                { name: "The Savoy", price: 2900 },
                { name: "Four Seasons Hotel London at Park Lane", price: 3100 },
                { name: "The Langham, London", price: 2700 },
                { name: "Mandarin Oriental Hyde Park", price: 3200 }
            ]
        },
        {
            city: "Amsterdam",
            hotels: [
                { name: "The Dylan Amsterdam", price: 1200 },
                { name: "Hotel Okura Amsterdam", price: 1600 },
                { name: "W Amsterdam", price: 1500 },
                { name: "InterContinental Amstel Amsterdam", price: 2000 },
                { name: "Conservatorium Hotel", price: 2200 },
                { name: "Pulitzer Amsterdam", price: 1800 }
            ]
        },
        {
            city: "San Francisco",
            hotels: [
                { name: "The Fairmont", price: 1500 },
                { name: "Palace Hotel", price: 1800 },
                { name: "Hotel Nikko San Francisco", price: 1300 },
                { name: "St. Regis San Francisco", price: 2200 },
                { name: "Four Seasons Hotel San Francisco", price: 2000 },
                { name: "Mandarin Oriental San Francisco", price: 2300 }
            ]
        },
        {
            city: "Toronto",
            hotels: [
                { name: "The Ritz-Carlton, Toronto", price: 2200 },
                { name: "Four Seasons Hotel Toronto", price: 1800 },
                { name: "Shangri-La Hotel Toronto", price: 2000 },
                { name: "The St. Regis Toronto", price: 2400 },
                { name: "The Hazelton Hotel Toronto", price: 1600 },
                { name: "Royal York Hotel", price: 1500 }
            ]
        },
        {
            city: "Madrid",
            hotels: [
                { name: "The Ritz Madrid", price: 2200 },
                { name: "Hotel Villa Magna", price: 2000 },
                { name: "Four Seasons Hotel Madrid", price: 2400 },
                { name: "Mandarin Oriental Ritz Madrid", price: 2700 },
                { name: "Hotel de las Letras", price: 1500 },
                { name: "Gran Melia Fenix", price: 1800 }
            ]
        },
        {
            city: "Seoul",
            hotels: [
                { name: "The Shilla Seoul", price: 2000 },
                { name: "Four Seasons Hotel Seoul", price: 2200 },
                { name: "Park Hyatt Seoul", price: 1800 },
                { name: "Lotte Hotel Seoul", price: 1600 },
                { name: "JW Marriott Hotel Seoul", price: 1900 },
                { name: "The Westin Chosun Seoul", price: 1700 }
            ]
        },
        {
            city: "Los Angeles",
            hotels: [
                { name: "The Beverly Hills Hotel", price: 1500 },
                { name: "Hotel Bel-Air", price: 1800 },
                { name: "The Ritz-Carlton", price: 2000 },
                { name: "The London West Hollywood", price: 1700 },
                { name: "Four Seasons Hotel Los Angeles", price: 2200 },
                { name: "Shutters on the Beach", price: 2100 }
            ]
        },
        {
            city: "Lagos",
            hotels: [
                { name: "Eko Hotel & Suites", price: 1200 },
                { name: "The Wheatbaker", price: 1500 },
                { name: "Radisson Blu Anchorage Hotel", price: 1700 },
                { name: "Victoria Crown Plaza Hotel", price: 1100 },
                { name: "The Lagos Continental Hotel", price: 1300 },
                { name: "InterContinental Lagos", price: 1600 }
            ]
        },
        {
            city: "Dubai",
            hotels: [
                { name: "Burj Al Arab Jumeirah", price: 2500 },
                { name: "Atlantis The Palm", price: 2000 },
                { name: "Armani Hotel Dubai", price: 1800 },
                { name: "Jumeirah Beach Hotel", price: 2200 },
                { name: "The Ritz-Carlton, Dubai", price: 2100 },
                { name: "Palace Downtown Dubai", price: 2300 }
            ]
        },
        {
            city: "Mumbai",
            hotels: [
                { name: "The Taj Mahal Palace", price: 2500 },
                { name: "The Oberoi Mumbai", price: 2200 },
                { name: "The St. Regis Mumbai", price: 2300 },
                { name: "Trident Nariman Point", price: 2100 },
                { name: "JW Marriott Mumbai", price: 2000 },
                { name: "Hotel Marine Plaza", price: 1800 }
            ]
        },
        {
            city: "New York",
            hotels: [
                { name: "The Plaza Hotel", price: 3500 },
                { name: "The St. Regis New York", price: 4000 },
                { name: "The Ritz-Carlton New York, Central Park", price: 3800 },
                { name: "Park Hyatt New York", price: 3600 },
                { name: "Mandarin Oriental New York", price: 3700 },
                { name: "Four Seasons Hotel New York", price: 4200 }
            ]
        },
        {
            city: "Berlin",
            hotels: [
                { name: "Hotel Adlon Kempinski", price: 2500 },
                { name: "The Ritz-Carlton, Berlin", price: 2200 },
                { name: "Regent Berlin", price: 2300 },
                { name: "Hotel de Rome", price: 2400 },
                { name: "Grand Hyatt Berlin", price: 2100 },
                { name: "InterContinental Berlin", price: 2000 }
            ]
        },
        {
            city: "Barcelona",
            hotels: [
                { name: "Mandarin Oriental, Barcelona", price: 2600 },
                { name: "Hotel Arts Barcelona", price: 2500 },
                { name: "W Barcelona", price: 2300 },
                { name: "Almanac Barcelona", price: 2200 },
                { name: "The One Barcelona", price: 2100 },
                { name: "Majestic Hotel & Spa Barcelona", price: 2000 }
            ]
        },
        {
            city: "Rome",
            hotels: [
                { name: "Hassler Roma", price: 2700 },
                { name: "Hotel Eden", price: 2600 },
                { name: "The St. Regis Rome", price: 2500 },
                { name: "J.K. Place Roma", price: 2300 },
                { name: "Hotel de Russie", price: 2200 },
                { name: "Baglioni Hotel Regina", price: 2100 }
            ]
        },
        {
            city: "Tokyo",
            hotels: [
                { name: "Aman Tokyo", price: 2800 },
                { name: "The Ritz-Carlton, Tokyo", price: 2700 },
                { name: "Mandarin Oriental, Tokyo", price: 2500 },
                { name: "Park Hyatt Tokyo", price: 2400 },
                { name: "Four Seasons Hotel Tokyo", price: 2300 },
                { name: "Shangri-La Hotel Tokyo", price: 2200 }
            ]
        }
    ]
);

use("travel");
db.hotels.find();
