const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");

// Load env vars
dotenv.config();

// Helper to generate unique SKUs
const generateSKU = (category, index) => {
  const prefix = category.substring(0, 3).toUpperCase();
  return `${prefix}-${String(index).padStart(4, '0')}`;
};

// Helper to get random number between min and max
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to get random rating (3.5-5.0)
const randomRating = () => (Math.random() * 1.5 + 3.5).toFixed(1);

const toINR = (amount) => Math.round(amount * 83);

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const buildImageUrl = (product) => {
  const query = `${product.category} ${product.name}`.trim();
  return `https://source.unsplash.com/400x400/?${encodeURIComponent(query)}`;
};

// Sample products data
const products = [
  // ELECTRONICS (11 products)
  {
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for work, travel, and music.",
    price: 99.99,
    originalPrice: 149.99,
    discountPercentage: 33,
    image: "https://picsum.photos/seed/headphones/400/300",
    thumbnail: "https://picsum.photos/seed/headphones-thumb/200/200",
    images: [
      "https://picsum.photos/seed/headphones1/400/300",
      "https://picsum.photos/seed/headphones2/400/300",
      "https://picsum.photos/seed/headphones3/400/300",
      "https://picsum.photos/seed/headphones4/400/300"
    ],
    category: "Electronics",
    brand: "SoundPro",
    rating: 4.6,
    reviewCount: 234,
    stock: 50,
    features: ["Active Noise Cancellation", "30hr Battery", "Bluetooth 5.3", "Premium Sound"],
    specifications: {
      "Battery Life": "30 hours",
      "Bluetooth Version": "5.3",
      "Weight": "250g",
      "Color": "Black"
    },
    sku: generateSKU("Electronics", 1),
    availability: "In Stock",
    tags: ["Audio", "Wireless", "Noise Cancelling"]
  },
  {
    name: "Smart Watch Pro",
    description: "Feature-rich smartwatch with heart rate monitor, GPS, sleep tracking, and 7-day battery life. Water-resistant up to 50m.",
    price: 199.99,
    originalPrice: 299.99,
    discountPercentage: 33,
    image: "https://picsum.photos/seed/smartwatch/400/300",
    thumbnail: "https://picsum.photos/seed/smartwatch-thumb/200/200",
    images: [
      "https://picsum.photos/seed/smartwatch1/400/300",
      "https://picsum.photos/seed/smartwatch2/400/300",
      "https://picsum.photos/seed/smartwatch3/400/300",
      "https://picsum.photos/seed/smartwatch4/400/300"
    ],
    category: "Electronics",
    brand: "TechGear",
    rating: 4.4,
    reviewCount: 456,
    stock: 35,
    features: ["GPS", "Heart Rate Monitor", "Sleep Tracking", "Water Resistant"],
    specifications: {
      "Display": "1.4\" AMOLED",
      "Battery Life": "7 days",
      "Water Resistance": "50m",
      "Strap Material": "Silicone"
    },
    sku: generateSKU("Electronics", 2),
    availability: "In Stock",
    tags: ["Smartwatch", "Wearable", "Fitness"]
  },
  {
    name: "Wireless Earbuds",
    description: "True wireless earbuds with touch controls, 24-hour total battery life, and clear call quality. Perfect for daily commutes.",
    price: 49.99,
    originalPrice: 79.99,
    discountPercentage: 37,
    image: "https://picsum.photos/seed/earbuds/400/300",
    thumbnail: "https://picsum.photos/seed/earbuds-thumb/200/200",
    images: [
      "https://picsum.photos/seed/earbuds1/400/300",
      "https://picsum.photos/seed/earbuds2/400/300",
      "https://picsum.photos/seed/earbuds3/400/300",
      "https://picsum.photos/seed/earbuds4/400/300"
    ],
    category: "Electronics",
    brand: "SoundPro",
    rating: 4.5,
    reviewCount: 189,
    stock: 80,
    features: ["Touch Controls", "24hr Battery", "Wireless Charging"],
    specifications: {
      "Battery per Charge": "6 hours",
      "Total Battery": "24 hours",
      "Charging Case": "Included"
    },
    sku: generateSKU("Electronics", 3),
    availability: "In Stock",
    tags: ["Earbuds", "Wireless", "Audio"]
  },
  {
    name: "Gaming Keyboard",
    description: "Mechanical gaming keyboard with RGB backlighting, anti-ghosting, and durable key switches designed for long gaming sessions.",
    price: 129.99,
    originalPrice: 179.99,
    discountPercentage: 28,
    image: "https://picsum.photos/seed/gaming-keyboard/400/300",
    thumbnail: "https://picsum.photos/seed/gaming-keyboard-thumb/200/200",
    images: [
      "https://picsum.photos/seed/gaming-keyboard1/400/300",
      "https://picsum.photos/seed/gaming-keyboard2/400/300",
      "https://picsum.photos/seed/gaming-keyboard3/400/300",
      "https://picsum.photos/seed/gaming-keyboard4/400/300"
    ],
    category: "Electronics",
    brand: "GameX",
    rating: 4.8,
    reviewCount: 312,
    stock: 45,
    features: ["RGB Backlight", "Mechanical Switches", "Anti-Ghosting"],
    specifications: {
      "Switch Type": "Cherry MX Red",
      "Key Count": "104",
      "Connection": "USB"
    },
    sku: generateSKU("Electronics", 4),
    availability: "In Stock",
    tags: ["Gaming", "Keyboard", "Mechanical"]
  },
  {
    name: "Gaming Mouse",
    description: "Ergonomic gaming mouse with adjustable DPI up to 16000, programmable buttons, and RGB lighting for precision gaming.",
    price: 59.99,
    originalPrice: 89.99,
    discountPercentage: 33,
    image: "https://picsum.photos/seed/gaming-mouse/400/300",
    thumbnail: "https://picsum.photos/seed/gaming-mouse-thumb/200/200",
    images: [
      "https://picsum.photos/seed/gaming-mouse1/400/300",
      "https://picsum.photos/seed/gaming-mouse2/400/300",
      "https://picsum.photos/seed/gaming-mouse3/400/300",
      "https://picsum.photos/seed/gaming-mouse4/400/300"
    ],
    category: "Electronics",
    brand: "GameX",
    rating: 4.7,
    reviewCount: 256,
    stock: 60,
    features: ["16000 DPI", "Programmable Buttons", "RGB Lighting"],
    specifications: {
      "DPI Range": "200-16000",
      "Buttons": "8",
      "Connection": "USB"
    },
    sku: generateSKU("Electronics", 5),
    availability: "In Stock",
    tags: ["Gaming", "Mouse", "RGB"]
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with 360-degree sound, IPX5 water resistance, and 12-hour battery life for outdoor use.",
    price: 79.99,
    originalPrice: 119.99,
    discountPercentage: 33,
    image: "https://picsum.photos/seed/bluetooth-speaker/400/300",
    thumbnail: "https://picsum.photos/seed/bluetooth-speaker-thumb/200/200",
    images: [
      "https://picsum.photos/seed/bluetooth-speaker1/400/300",
      "https://picsum.photos/seed/bluetooth-speaker2/400/300",
      "https://picsum.photos/seed/bluetooth-speaker3/400/300",
      "https://picsum.photos/seed/bluetooth-speaker4/400/300"
    ],
    category: "Electronics",
    brand: "SoundPro",
    rating: 4.3,
    reviewCount: 178,
    stock: 55,
    features: ["360-Degree Sound", "IPX5 Water Resistance", "12hr Battery"],
    specifications: {
      "Battery Life": "12 hours",
      "Water Resistance": "IPX5",
      "Weight": "350g"
    },
    sku: generateSKU("Electronics", 6),
    availability: "In Stock",
    tags: ["Speaker", "Bluetooth", "Portable"]
  },
  {
    name: "Laptop Backpack",
    description: "Durable laptop backpack with padded compartments for up to 15.6\" laptops, multiple pockets, and water-resistant fabric.",
    price: 39.99,
    originalPrice: 59.99,
    discountPercentage: 33,
    image: "https://picsum.photos/seed/laptop-backpack/400/300",
    thumbnail: "https://picsum.photos/seed/laptop-backpack-thumb/200/200",
    images: [
      "https://picsum.photos/seed/laptop-backpack1/400/300",
      "https://picsum.photos/seed/laptop-backpack2/400/300",
      "https://picsum.photos/seed/laptop-backpack3/400/300",
      "https://picsum.photos/seed/laptop-backpack4/400/300"
    ],
    category: "Electronics",
    brand: "TravelMax",
    rating: 4.4,
    reviewCount: 423,
    stock: 100,
    features: ["Fits 15.6\" Laptop", "Water Resistant", "Multiple Pockets"],
    specifications: {
      "Laptop Size": "Up to 15.6\"",
      "Material": "Polyester",
      "Capacity": "25L"
    },
    sku: generateSKU("Electronics", 7),
    availability: "In Stock",
    tags: ["Backpack", "Laptop", "Travel"]
  },
  {
    name: "Power Bank",
    description: "High-capacity 20000mAh power bank with fast charging, dual USB ports, and LED indicator for on-the-go charging.",
    price: 34.99,
    originalPrice: 54.99,
    discountPercentage: 36,
    image: "https://picsum.photos/seed/power-bank/400/300",
    thumbnail: "https://picsum.photos/seed/power-bank-thumb/200/200",
    images: [
      "https://picsum.photos/seed/power-bank1/400/300",
      "https://picsum.photos/seed/power-bank2/400/300",
      "https://picsum.photos/seed/power-bank3/400/300",
      "https://picsum.photos/seed/power-bank4/400/300"
    ],
    category: "Electronics",
    brand: "ChargeTech",
    rating: 4.5,
    reviewCount: 289,
    stock: 90,
    features: ["20000mAh", "Fast Charging", "Dual USB Ports"],
    specifications: {
      "Capacity": "20000mAh",
      "Output": "2.1A",
      "Input": "Micro USB"
    },
    sku: generateSKU("Electronics", 8),
    availability: "In Stock",
    tags: ["Power Bank", "Portable Charger", "Accessories"]
  },
  {
    name: "USB-C Hub",
    description: "7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery for laptops and tablets.",
    price: 44.99,
    originalPrice: 69.99,
    discountPercentage: 36,
    image: "https://picsum.photos/seed/usb-c-hub/400/300",
    thumbnail: "https://picsum.photos/seed/usb-c-hub-thumb/200/200",
    images: [
      "https://picsum.photos/seed/usb-c-hub1/400/300",
      "https://picsum.photos/seed/usb-c-hub2/400/300",
      "https://picsum.photos/seed/usb-c-hub3/400/300",
      "https://picsum.photos/seed/usb-c-hub4/400/300"
    ],
    category: "Electronics",
    brand: "ConnectPro",
    rating: 4.6,
    reviewCount: 145,
    stock: 75,
    features: ["7-in-1", "HDMI", "USB 3.0", "SD Card Reader"],
    specifications: {
      "Ports": "7",
      "HDMI": "4K@30Hz",
      "USB-C Power Delivery": "60W"
    },
    sku: generateSKU("Electronics", 9),
    availability: "In Stock",
    tags: ["USB-C", "Hub", "Accessories"]
  },
  {
    name: "Webcam",
    description: "Full HD 1080p webcam with built-in microphone, auto-focus, and low-light correction for video calls and streaming.",
    price: 69.99,
    originalPrice: 99.99,
    discountPercentage: 30,
    image: "https://picsum.photos/seed/webcam/400/300",
    thumbnail: "https://picsum.photos/seed/webcam-thumb/200/200",
    images: [
      "https://picsum.photos/seed/webcam1/400/300",
      "https://picsum.photos/seed/webcam2/400/300",
      "https://picsum.photos/seed/webcam3/400/300",
      "https://picsum.photos/seed/webcam4/400/300"
    ],
    category: "Electronics",
    brand: "VisionTech",
    rating: 4.2,
    reviewCount: 210,
    stock: 65,
    features: ["1080p", "Built-in Mic", "Auto Focus", "Low-Light Correction"],
    specifications: {
      "Resolution": "1920x1080",
      "FPS": "30",
      "Connection": "USB 2.0"
    },
    sku: generateSKU("Electronics", 10),
    availability: "In Stock",
    tags: ["Webcam", "Video Call", "Accessories"]
  },
  {
    name: "Portable SSD",
    description: "1TB portable SSD with USB 3.2 Gen 2, fast transfer speeds up to 1050MB/s, and durable shock-resistant design.",
    price: 119.99,
    originalPrice: 159.99,
    discountPercentage: 25,
    image: "https://picsum.photos/seed/portable-ssd/400/300",
    thumbnail: "https://picsum.photos/seed/portable-ssd-thumb/200/200",
    images: [
      "https://picsum.photos/seed/portable-ssd1/400/300",
      "https://picsum.photos/seed/portable-ssd2/400/300",
      "https://picsum.photos/seed/portable-ssd3/400/300",
      "https://picsum.photos/seed/portable-ssd4/400/300"
    ],
    category: "Electronics",
    brand: "StorageMax",
    rating: 4.7,
    reviewCount: 345,
    stock: 40,
    features: ["1TB Capacity", "1050MB/s Speed", "Shock Resistant"],
    specifications: {
      "Capacity": "1TB",
      "Speed": "1050MB/s",
      "Interface": "USB 3.2 Gen 2"
    },
    sku: generateSKU("Electronics", 11),
    availability: "In Stock",
    tags: ["SSD", "Storage", "Portable"]
  },

  // CLOTHING (10 products)
  {
    name: "Cotton T-Shirt",
    description: "Comfortable 100% cotton t-shirt available in multiple colors. Perfect for everyday wear, casual outings, or lounging at home.",
    price: 24.99,
    originalPrice: 34.99,
    discountPercentage: 29,
    image: "https://picsum.photos/seed/cotton-tshirt/400/300",
    thumbnail: "https://picsum.photos/seed/cotton-tshirt-thumb/200/200",
    images: [
      "https://picsum.photos/seed/cotton-tshirt1/400/300",
      "https://picsum.photos/seed/cotton-tshirt2/400/300",
      "https://picsum.photos/seed/cotton-tshirt3/400/300",
      "https://picsum.photos/seed/cotton-tshirt4/400/300"
    ],
    category: "Clothing",
    brand: "UrbanWear",
    rating: 4.4,
    reviewCount: 567,
    stock: 150,
    features: ["100% Cotton", "Multiple Colors", "Regular Fit"],
    specifications: {
      "Material": "100% Cotton",
      "Fit": "Regular",
      "Care": "Machine Washable"
    },
    sku: generateSKU("Clothing", 1),
    availability: "In Stock",
    tags: ["T-Shirt", "Cotton", "Casual"]
  },
  {
    name: "Polo Shirt",
    description: "Classic polo shirt made from premium cotton blend, with ribbed collar and cuffs. Suitable for semi-casual occasions.",
    price: 39.99,
    originalPrice: 54.99,
    discountPercentage: 27,
    image: "https://picsum.photos/seed/polo-shirt/400/300",
    thumbnail: "https://picsum.photos/seed/polo-shirt-thumb/200/200",
    images: [
      "https://picsum.photos/seed/polo-shirt1/400/300",
      "https://picsum.photos/seed/polo-shirt2/400/300",
      "https://picsum.photos/seed/polo-shirt3/400/300",
      "https://picsum.photos/seed/polo-shirt4/400/300"
    ],
    category: "Clothing",
    brand: "UrbanWear",
    rating: 4.3,
    reviewCount: 345,
    stock: 120,
    features: ["Ribbed Collar", "Cotton Blend", "Semi-Casual"],
    specifications: {
      "Material": "Cotton Blend",
      "Fit": "Classic",
      "Care": "Machine Washable"
    },
    sku: generateSKU("Clothing", 2),
    availability: "In Stock",
    tags: ["Polo", "Shirt", "Semi-Casual"]
  },
  {
    name: "Denim Jacket",
    description: "Timeless denim jacket with button closure, multiple pockets, and classic fit. Perfect for layering in any season.",
    price: 89.99,
    originalPrice: 129.99,
    discountPercentage: 31,
    image: "https://picsum.photos/seed/denim-jacket/400/300",
    thumbnail: "https://picsum.photos/seed/denim-jacket-thumb/200/200",
    images: [
      "https://picsum.photos/seed/denim-jacket1/400/300",
      "https://picsum.photos/seed/denim-jacket2/400/300",
      "https://picsum.photos/seed/denim-jacket3/400/300",
      "https://picsum.photos/seed/denim-jacket4/400/300"
    ],
    category: "Clothing",
    brand: "DenimCo",
    rating: 4.6,
    reviewCount: 289,
    stock: 85,
    features: ["Button Closure", "Multiple Pockets", "Classic Fit"],
    specifications: {
      "Material": "Cotton Denim",
      "Fit": "Classic",
      "Care": "Machine Washable"
    },
    sku: generateSKU("Clothing", 3),
    availability: "In Stock",
    tags: ["Denim", "Jacket", "Outerwear"]
  },
  {
    name: "Hoodie",
    description: "Cozy fleece hoodie with kangaroo pocket, drawstring hood, and ribbed cuffs. Perfect for staying warm in style.",
    price: 54.99,
    originalPrice: 79.99,
    discountPercentage: 31,
    image: "https://picsum.photos/seed/hoodie/400/300",
    thumbnail: "https://picsum.photos/seed/hoodie-thumb/200/200",
    images: [
      "https://picsum.photos/seed/hoodie1/400/300",
      "https://picsum.photos/seed/hoodie2/400/300",
      "https://picsum.photos/seed/hoodie3/400/300",
      "https://picsum.photos/seed/hoodie4/400/300"
    ],
    category: "Clothing",
    brand: "ComfortWear",
    rating: 4.5,
    reviewCount: 456,
    stock: 130,
    features: ["Kangaroo Pocket", "Drawstring Hood", "Ribbed Cuffs"],
    specifications: {
      "Material": "Fleece",
      "Fit": "Regular",
      "Care": "Machine Washable"
    },
    sku: generateSKU("Clothing", 4),
    availability: "In Stock",
    tags: ["Hoodie", "Fleece", "Winter"]
  },
  {
    name: "Jeans",
    description: "Classic straight-fit jeans made from premium denim, with a modern wash for a stylish look.",
    price: 69.99,
    originalPrice: 99.99,
    discountPercentage: 30,
    image: "https://picsum.photos/seed/jeans/400/300",
    thumbnail: "https://picsum.photos/seed/jeans-thumb/200/200",
    images: [
      "https://picsum.photos/seed/jeans1/400/300",
      "https://picsum.photos/seed/jeans2/400/300",
      "https://picsum.photos/seed/jeans3/400/300",
      "https://picsum.photos/seed/jeans4/400/300"
    ],
    category: "Clothing",
    brand: "DenimCo",
    rating: 4.4,
    reviewCount: 523,
    stock: 110,
    features: ["Straight Fit", "Premium Denim", "Modern Wash"],
    specifications: {
      "Material": "Denim",
      "Fit": "Straight",
      "Care": "Machine Washable"
    },
    sku: generateSKU("Clothing", 5),
    availability: "In Stock",
    tags: ["Jeans", "Denim", "Pants"]
  },
  {
    name: "Chinos",
    description: "Smart-casual chino pants with slim fit, made from comfortable cotton twill. Perfect for work or weekend.",
    price: 59.99,
    originalPrice: 84.99,
    discountPercentage: 29,
    image: "https://picsum.photos/seed/chinos/400/300",
    thumbnail: "https://picsum.photos/seed/chinos-thumb/200/200",
    images: [
      "https://picsum.photos/seed/chinos1/400/300",
      "https://picsum.photos/seed/chinos2/400/300",
      "https://picsum.photos/seed/chinos3/400/300",
      "https://picsum.photos/seed/chinos4/400/300"
    ],
    category: "Clothing",
    brand: "UrbanWear",
    rating: 4.3,
    reviewCount: 298,
    stock: 95,
    features: ["Slim Fit", "Cotton Twill", "Smart-Casual"],
    specifications: {
      "Material": "Cotton Twill",
      "Fit": "Slim",
      "Care": "Machine Washable"
    },
    sku: generateSKU("Clothing", 6),
    availability: "In Stock",
    tags: ["Chinos", "Pants", "Smart-Casual"]
  },
  {
    name: "Formal Shirt",
    description: "Crisp formal button-down shirt with spread collar, perfect for office wear or special occasions.",
    price: 49.99,
    originalPrice: 69.99,
    discountPercentage: 29,
    image: "https://picsum.photos/seed/formal-shirt/400/300",
    thumbnail: "https://picsum.photos/seed/formal-shirt-thumb/200/200",
    images: [
      "https://picsum.photos/seed/formal-shirt1/400/300",
      "https://picsum.photos/seed/formal-shirt2/400/300",
      "https://picsum.photos/seed/formal-shirt3/400/300",
      "https://picsum.photos/seed/formal-shirt4/400/300"
    ],
    category: "Clothing",
    brand: "UrbanWear",
    rating: 4.2,
    reviewCount: 234,
    stock: 105,
    features: ["Spread Collar", "Button-Down", "Formal"],
    specifications: {
      "Material": "Cotton Blend",
      "Fit": "Regular",
      "Care": "Machine Washable"
    },
    sku: generateSKU("Clothing", 7),
    availability: "In Stock",
    tags: ["Formal", "Shirt", "Office"]
  },
  {
    name: "Sweatshirt",
    description: "Soft crew-neck sweatshirt with brushed interior for extra warmth, ideal for casual wear.",
    price: 44.99,
    originalPrice: 64.99,
    discountPercentage: 31,
    image: "https://picsum.photos/seed/sweatshirt/400/300",
    thumbnail: "https://picsum.photos/seed/sweatshirt-thumb/200/200",
    images: [
      "https://picsum.photos/seed/sweatshirt1/400/300",
      "https://picsum.photos/seed/sweatshirt2/400/300",
      "https://picsum.photos/seed/sweatshirt3/400/300",
      "https://picsum.photos/seed/sweatshirt4/400/300"
    ],
    category: "Clothing",
    brand: "ComfortWear",
    rating: 4.5,
    reviewCount: 367,
    stock: 140,
    features: ["Crew-Neck", "Brushed Interior", "Soft Fabric"],
    specifications: {
      "Material": "Cotton Blend",
      "Fit": "Regular",
      "Care": "Machine Washable"
    },
    sku: generateSKU("Clothing", 8),
    availability: "In Stock",
    tags: ["Sweatshirt", "Casual", "Winter"]
  },
  {
    name: "Cargo Pants",
    description: "Functional cargo pants with multiple pockets, durable fabric, and relaxed fit for outdoor activities.",
    price: 54.99,
    originalPrice: 79.99,
    discountPercentage: 31,
    image: "https://picsum.photos/seed/cargo-pants/400/300",
    thumbnail: "https://picsum.photos/seed/cargo-pants-thumb/200/200",
    images: [
      "https://picsum.photos/seed/cargo-pants1/400/300",
      "https://picsum.photos/seed/cargo-pants2/400/300",
      "https://picsum.photos/seed/cargo-pants3/400/300",
      "https://picsum.photos/seed/cargo-pants4/400/300"
    ],
    category: "Clothing",
    brand: "OutdoorPro",
    rating: 4.3,
    reviewCount: 278,
    stock: 90,
    features: ["Multiple Pockets", "Durable Fabric", "Relaxed Fit"],
    specifications: {
      "Material": "Cotton Blend",
      "Fit": "Relaxed",
      "Care": "Machine Washable"
    },
    sku: generateSKU("Clothing", 9),
    availability: "In Stock",
    tags: ["Cargo", "Pants", "Outdoor"]
  },
  {
    name: "Running Shorts",
    description: "Lightweight, breathable running shorts with moisture-wicking fabric and built-in liner for comfort during workouts.",
    price: 29.99,
    originalPrice: 44.99,
    discountPercentage: 33,
    image: "https://picsum.photos/seed/running-shorts/400/300",
    thumbnail: "https://picsum.photos/seed/running-shorts-thumb/200/200",
    images: [
      "https://picsum.photos/seed/running-shorts1/400/300",
      "https://picsum.photos/seed/running-shorts2/400/300",
      "https://picsum.photos/seed/running-shorts3/400/300",
      "https://picsum.photos/seed/running-shorts4/400/300"
    ],
    category: "Clothing",
    brand: "SportWear",
    rating: 4.4,
    reviewCount: 312,
    stock: 160,
    features: ["Moisture-Wicking", "Breathable", "Built-in Liner"],
    specifications: {
      "Material": "Polyester Blend",
      "Fit": "Athletic",
      "Care": "Machine Washable"
    },
    sku: generateSKU("Clothing", 10),
    availability: "In Stock",
    tags: ["Shorts", "Running", "Athletic"]
  },

  // HOME (10 products)
  {
    name: "LED Table Lamp",
    description: "Adjustable LED table lamp with multiple brightness levels and color temperatures for reading and working.",
    price: 49.99,
    originalPrice: 69.99,
    discountPercentage: 29,
    image: "https://picsum.photos/seed/led-lamp/400/300",
    thumbnail: "https://picsum.photos/seed/led-lamp-thumb/200/200",
    images: [
      "https://picsum.photos/seed/led-lamp1/400/300",
      "https://picsum.photos/seed/led-lamp2/400/300",
      "https://picsum.photos/seed/led-lamp3/400/300",
      "https://picsum.photos/seed/led-lamp4/400/300"
    ],
    category: "Home",
    brand: "BrightHome",
    rating: 4.5,
    reviewCount: 389,
    stock: 100,
    features: ["Adjustable", "Multiple Brightness", "Color Temperature"],
    specifications: {
      "Power": "12W",
      "Color Temp": "2700K-6500K",
      "Material": "ABS"
    },
    sku: generateSKU("Home", 1),
    availability: "In Stock",
    tags: ["Lamp", "LED", "Home Decor"]
  },
  {
    name: "Coffee Maker",
    description: "Programmable drip coffee maker with 12-cup capacity, auto-shutoff, and reusable filter for daily coffee brewing.",
    price: 69.99,
    originalPrice: 99.99,
    discountPercentage: 30,
    image: "https://picsum.photos/seed/coffee-maker/400/300",
    thumbnail: "https://picsum.photos/seed/coffee-maker-thumb/200/200",
    images: [
      "https://picsum.photos/seed/coffee-maker1/400/300",
      "https://picsum.photos/seed/coffee-maker2/400/300",
      "https://picsum.photos/seed/coffee-maker3/400/300",
      "https://picsum.photos/seed/coffee-maker4/400/300"
    ],
    category: "Home",
    brand: "KitchenPro",
    rating: 4.4,
    reviewCount: 256,
    stock: 80,
    features: ["12-Cup", "Programmable", "Reusable Filter"],
    specifications: {
      "Capacity": "12 Cups",
      "Power": "900W",
      "Material": "Stainless Steel"
    },
    sku: generateSKU("Home", 2),
    availability: "In Stock",
    tags: ["Coffee Maker", "Kitchen", "Appliance"]
  },
  {
    name: "Vacuum Cleaner",
    description: "Bagless upright vacuum cleaner with HEPA filter, strong suction, and multiple attachments for carpets and floors.",
    price: 149.99,
    originalPrice: 199.99,
    discountPercentage: 25,
    image: "https://picsum.photos/seed/vacuum/400/300",
    thumbnail: "https://picsum.photos/seed/vacuum-thumb/200/200",
    images: [
      "https://picsum.photos/seed/vacuum1/400/300",
      "https://picsum.photos/seed/vacuum2/400/300",
      "https://picsum.photos/seed/vacuum3/400/300",
      "https://picsum.photos/seed/vacuum4/400/300"
    ],
    category: "Home",
    brand: "CleanTech",
    rating: 4.3,
    reviewCount: 198,
    stock: 60,
    features: ["Bagless", "HEPA Filter", "Strong Suction"],
    specifications: {
      "Power": "1600W",
      "Filter": "HEPA",
      "Capacity": "2.5L"
    },
    sku: generateSKU("Home", 3),
    availability: "In Stock",
    tags: ["Vacuum", "Cleaning", "Home"]
  },
  {
    name: "Air Fryer",
    description: "5.5-quart air fryer with digital controls, 8 preset cooking functions, and easy-to-clean non-stick basket.",
    price: 99.99,
    originalPrice: 139.99,
    discountPercentage: 29,
    image: "https://picsum.photos/seed/air-fryer/400/300",
    thumbnail: "https://picsum.photos/seed/air-fryer-thumb/200/200",
    images: [
      "https://picsum.photos/seed/air-fryer1/400/300",
      "https://picsum.photos/seed/air-fryer2/400/300",
      "https://picsum.photos/seed/air-fryer3/400/300",
      "https://picsum.photos/seed/air-fryer4/400/300"
    ],
    category: "Home",
    brand: "KitchenPro",
    rating: 4.6,
    reviewCount: 423,
    stock: 70,
    features: ["5.5-Quart", "Digital Controls", "8 Preset Functions"],
    specifications: {
      "Capacity": "5.5L",
      "Power": "1700W",
      "Temp Range": "170-400°F"
    },
    sku: generateSKU("Home", 4),
    availability: "In Stock",
    tags: ["Air Fryer", "Kitchen", "Appliance"]
  },
  {
    name: "Blender",
    description: "1000W high-performance blender with 6-speed settings, pulse function, and 64oz BPA-free jar.",
    price: 79.99,
    originalPrice: 114.99,
    discountPercentage: 30,
    image: "https://picsum.photos/seed/blender/400/300",
    thumbnail: "https://picsum.photos/seed/blender-thumb/200/200",
    images: [
      "https://picsum.photos/seed/blender1/400/300",
      "https://picsum.photos/seed/blender2/400/300",
      "https://picsum.photos/seed/blender3/400/300",
      "https://picsum.photos/seed/blender4/400/300"
    ],
    category: "Home",
    brand: "KitchenPro",
    rating: 4.4,
    reviewCount: 345,
    stock: 85,
    features: ["1000W", "6-Speed", "Pulse Function"],
    specifications: {
      "Power": "1000W",
      "Capacity": "64oz",
      "Jar Material": "Tritan"
    },
    sku: generateSKU("Home", 5),
    availability: "In Stock",
    tags: ["Blender", "Kitchen", "Appliance"]
  },
  {
    name: "Wall Clock",
    description: "Modern minimalist wall clock with silent sweep movement, easy-to-read large numerals.",
    price: 29.99,
    originalPrice: 44.99,
    discountPercentage: 33,
    image: "https://picsum.photos/seed/wall-clock/400/300",
    thumbnail: "https://picsum.photos/seed/wall-clock-thumb/200/200",
    images: [
      "https://picsum.photos/seed/wall-clock1/400/300",
      "https://picsum.photos/seed/wall-clock2/400/300",
      "https://picsum.photos/seed/wall-clock3/400/300",
      "https://picsum.photos/seed/wall-clock4/400/300"
    ],
    category: "Home",
    brand: "TimeMaster",
    rating: 4.3,
    reviewCount: 234,
    stock: 120,
    features: ["Silent Sweep", "Large Numerals", "Minimalist Design"],
    specifications: {
      "Diameter": "12\"",
      "Movement": "Quartz",
      "Material": "Plastic"
    },
    sku: generateSKU("Home", 6),
    availability: "In Stock",
    tags: ["Clock", "Home Decor", "Wall"]
  },
  {
    name: "Storage Basket",
    description: "Set of 3 woven storage baskets in different sizes, perfect for organizing clothes, toys, or blankets.",
    price: 39.99,
    originalPrice: 59.99,
    discountPercentage: 33,
    image: "https://picsum.photos/seed/storage-basket/400/300",
    thumbnail: "https://picsum.photos/seed/storage-basket-thumb/200/200",
    images: [
      "https://picsum.photos/seed/storage-basket1/400/300",
      "https://picsum.photos/seed/storage-basket2/400/300",
      "https://picsum.photos/seed/storage-basket3/400/300",
      "https://picsum.photos/seed/storage-basket4/400/300"
    ],
    category: "Home",
    brand: "OrganizeIt",
    rating: 4.5,
    reviewCount: 312,
    stock: 150,
    features: ["Set of 3", "Woven", "Different Sizes"],
    specifications: {
      "Material": "Woven",
      "Sizes": "Small/Medium/Large",
      "Color": "Natural"
    },
    sku: generateSKU("Home", 7),
    availability: "In Stock",
    tags: ["Storage", "Basket", "Home"]
  },
  {
    name: "Bed Sheet Set",
    description: "Soft microfiber bed sheet set with deep pockets, wrinkle-resistant, available in multiple colors.",
    price: 49.99,
    originalPrice: 74.99,
    discountPercentage: 33,
    image: "https://picsum.photos/seed/bed-sheets/400/300",
    thumbnail: "https://picsum.photos/seed/bed-sheets-thumb/200/200",
    images: [
      "https://picsum.photos/seed/bed-sheets1/400/300",
      "https://picsum.photos/seed/bed-sheets2/400/300",
      "https://picsum.photos/seed/bed-sheets3/400/300",
      "https://picsum.photos/seed/bed-sheets4/400/300"
    ],
    category: "Home",
    brand: "SleepWell",
    rating: 4.6,
    reviewCount: 456,
    stock: 130,
    features: ["Deep Pockets", "Wrinkle-Resistant", "Microfiber"],
    specifications: {
      "Material": "Microfiber",
      "Size": "Queen",
      "Pocket Depth": "15\""
    },
    sku: generateSKU("Home", 8),
    availability: "In Stock",
    tags: ["Bed Sheets", "Bedding", "Home"]
  },
  {
    name: "Dining Chair",
    description: "Set of 2 modern dining chairs with padded seats and sturdy wooden legs, perfect for kitchen or dining room.",
    price: 129.99,
    originalPrice: 179.99,
    discountPercentage: 28,
    image: "https://picsum.photos/seed/dining-chair/400/300",
    thumbnail: "https://picsum.photos/seed/dining-chair-thumb/200/200",
    images: [
      "https://picsum.photos/seed/dining-chair1/400/300",
      "https://picsum.photos/seed/dining-chair2/400/300",
      "https://picsum.photos/seed/dining-chair3/400/300",
      "https://picsum.photos/seed/dining-chair4/400/300"
    ],
    category: "Home",
    brand: "HomeFurniture",
    rating: 4.4,
    reviewCount: 189,
    stock: 45,
    features: ["Set of 2", "Padded Seats", "Wooden Legs"],
    specifications: {
      "Material": "Fabric/Wood",
      "Weight Capacity": "250 lbs",
      "Height": "18\""
    },
    sku: generateSKU("Home", 9),
    availability: "In Stock",
    tags: ["Chair", "Dining", "Furniture"]
  },
  {
    name: "Kitchen Organizer",
    description: "Stackable kitchen organizer set with clear plastic bins for storing spices, snacks, or pantry items.",
    price: 34.99,
    originalPrice: 49.99,
    discountPercentage: 30,
    image: "https://picsum.photos/seed/kitchen-organizer/400/300",
    thumbnail: "https://picsum.photos/seed/kitchen-organizer-thumb/200/200",
    images: [
      "https://picsum.photos/seed/kitchen-organizer1/400/300",
      "https://picsum.photos/seed/kitchen-organizer2/400/300",
      "https://picsum.photos/seed/kitchen-organizer3/400/300",
      "https://picsum.photos/seed/kitchen-organizer4/400/300"
    ],
    category: "Home",
    brand: "OrganizeIt",
    rating: 4.3,
    reviewCount: 267,
    stock: 110,
    features: ["Stackable", "Clear Plastic", "Multiple Sizes"],
    specifications: {
      "Material": "Plastic",
      "Set Size": "6-Piece",
      "BPA Free": "Yes"
    },
    sku: generateSKU("Home", 10),
    availability: "In Stock",
    tags: ["Organizer", "Kitchen", "Storage"]
  },

  // BOOKS (10 products)
  {
    name: "Atomic Habits",
    description: "A groundbreaking guide to building good habits and breaking bad ones, with practical strategies for daily improvement.",
    price: 14.99,
    originalPrice: 24.99,
    discountPercentage: 40,
    image: "https://picsum.photos/seed/atomic-habits/400/300",
    thumbnail: "https://picsum.photos/seed/atomic-habits-thumb/200/200",
    images: [
      "https://picsum.photos/seed/atomic-habits1/400/300",
      "https://picsum.photos/seed/atomic-habits2/400/300",
      "https://picsum.photos/seed/atomic-habits3/400/300",
      "https://picsum.photos/seed/atomic-habits4/400/300"
    ],
    category: "Books",
    brand: "Penguin",
    rating: 4.8,
    reviewCount: 5678,
    stock: 200,
    features: ["Hardcover", "320 Pages", "Bestseller"],
    specifications: {
      "Author": "James Clear",
      "Pages": "320",
      "Format": "Hardcover"
    },
    sku: generateSKU("Books", 1),
    availability: "In Stock",
    tags: ["Self-Help", "Productivity", "Bestseller"]
  },
  {
    name: "The Psychology of Money",
    description: "Explores the psychology behind financial decisions, helping you make better choices with money.",
    price: 16.99,
    originalPrice: 27.99,
    discountPercentage: 39,
    image: "https://picsum.photos/seed/psychology-money/400/300",
    thumbnail: "https://picsum.photos/seed/psychology-money-thumb/200/200",
    images: [
      "https://picsum.photos/seed/psychology-money1/400/300",
      "https://picsum.photos/seed/psychology-money2/400/300",
      "https://picsum.photos/seed/psychology-money3/400/300",
      "https://picsum.photos/seed/psychology-money4/400/300"
    ],
    category: "Books",
    brand: "HarperCollins",
    rating: 4.7,
    reviewCount: 4567,
    stock: 180,
    features: ["Paperback", "272 Pages", "Financial"],
    specifications: {
      "Author": "Morgan Housel",
      "Pages": "272",
      "Format": "Paperback"
    },
    sku: generateSKU("Books", 2),
    availability: "In Stock",
    tags: ["Finance", "Psychology", "Bestseller"]
  },
  {
    name: "Deep Work",
    description: "Focused work in a distracted world. Rules for success in an age of constant interruption.",
    price: 15.99,
    originalPrice: 25.99,
    discountPercentage: 38,
    image: "https://picsum.photos/seed/deep-work/400/300",
    thumbnail: "https://picsum.photos/seed/deep-work-thumb/200/200",
    images: [
      "https://picsum.photos/seed/deep-work1/400/300",
      "https://picsum.photos/seed/deep-work2/400/300",
      "https://picsum.photos/seed/deep-work3/400/300",
      "https://picsum.photos/seed/deep-work4/400/300"
    ],
    category: "Books",
    brand: "Grand Central",
    rating: 4.6,
    reviewCount: 3456,
    stock: 170,
    features: ["Paperback", "296 Pages", "Productivity"],
    specifications: {
      "Author": "Cal Newport",
      "Pages": "296",
      "Format": "Paperback"
    },
    sku: generateSKU("Books", 3),
    availability: "In Stock",
    tags: ["Productivity", "Work", "Focus"]
  },
  {
    name: "Rich Dad Poor Dad",
    description: "What the rich teach their kids about money that the poor and middle class do not.",
    price: 12.99,
    originalPrice: 21.99,
    discountPercentage: 41,
    image: "https://picsum.photos/seed/rich-dad/400/300",
    thumbnail: "https://picsum.photos/seed/rich-dad-thumb/200/200",
    images: [
      "https://picsum.photos/seed/rich-dad1/400/300",
      "https://picsum.photos/seed/rich-dad2/400/300",
      "https://picsum.photos/seed/rich-dad3/400/300",
      "https://picsum.photos/seed/rich-dad4/400/300"
    ],
    category: "Books",
    brand: "Plata Publishing",
    rating: 4.4,
    reviewCount: 7890,
    stock: 250,
    features: ["Paperback", "336 Pages", "Personal Finance"],
    specifications: {
      "Author": "Robert T. Kiyosaki",
      "Pages": "336",
      "Format": "Paperback"
    },
    sku: generateSKU("Books", 4),
    availability: "In Stock",
    tags: ["Finance", "Investing", "Personal"]
  },
  {
    name: "The Alchemist",
    description: "A magical fable about following your dreams, set in the exotic locales of Spain and Egypt.",
    price: 13.99,
    originalPrice: 22.99,
    discountPercentage: 39,
    image: "https://picsum.photos/seed/alchemist/400/300",
    thumbnail: "https://picsum.photos/seed/alchemist-thumb/200/200",
    images: [
      "https://picsum.photos/seed/alchemist1/400/300",
      "https://picsum.photos/seed/alchemist2/400/300",
      "https://picsum.photos/seed/alchemist3/400/300",
      "https://picsum.photos/seed/alchemist4/400/300"
    ],
    category: "Books",
    brand: "HarperCollins",
    rating: 4.7,
    reviewCount: 8901,
    stock: 220,
    features: ["Paperback", "208 Pages", "Fiction"],
    specifications: {
      "Author": "Paulo Coelho",
      "Pages": "208",
      "Format": "Paperback"
    },
    sku: generateSKU("Books", 5),
    availability: "In Stock",
    tags: ["Fiction", "Inspiration", "Classic"]
  },
  {
    name: "Ikigai",
    description: "The Japanese secret to a long and happy life. Discover your reason for being.",
    price: 17.99,
    originalPrice: 28.99,
    discountPercentage: 38,
    image: "https://picsum.photos/seed/ikigai/400/300",
    thumbnail: "https://picsum.photos/seed/ikigai-thumb/200/200",
    images: [
      "https://picsum.photos/seed/ikigai1/400/300",
      "https://picsum.photos/seed/ikigai2/400/300",
      "https://picsum.photos/seed/ikigai3/400/300",
      "https://picsum.photos/seed/ikigai4/400/300"
    ],
    category: "Books",
    brand: "Penguin",
    rating: 4.5,
    reviewCount: 3210,
    stock: 160,
    features: ["Hardcover", "200 Pages", "Self-Help"],
    specifications: {
      "Author": "Ken Mogi",
      "Pages": "200",
      "Format": "Hardcover"
    },
    sku: generateSKU("Books", 6),
    availability: "In Stock",
    tags: ["Self-Help", "Japanese", "Life"]
  },
  {
    name: "Clean Code",
    description: "A handbook of agile software craftsmanship. Even bad code can function. But if it isn't clean.",
    price: 44.99,
    originalPrice: 64.99,
    discountPercentage: 31,
    image: "https://picsum.photos/seed/clean-code/400/300",
    thumbnail: "https://picsum.photos/seed/clean-code-thumb/200/200",
    images: [
      "https://picsum.photos/seed/clean-code1/400/300",
      "https://picsum.photos/seed/clean-code2/400/300",
      "https://picsum.photos/seed/clean-code3/400/300",
      "https://picsum.photos/seed/clean-code4/400/300"
    ],
    category: "Books",
    brand: "Prentice Hall",
    rating: 4.7,
    reviewCount: 6543,
    stock: 140,
    features: ["Paperback", "464 Pages", "Programming"],
    specifications: {
      "Author": "Robert C. Martin",
      "Pages": "464",
      "Format": "Paperback"
    },
    sku: generateSKU("Books", 7),
    availability: "In Stock",
    tags: ["Programming", "Software", "Coding"]
  },
  {
    name: "Think and Grow Rich",
    description: "The classic bestseller about the power of positive thinking and its role in achieving success.",
    price: 9.99,
    originalPrice: 17.99,
    discountPercentage: 44,
    image: "https://picsum.photos/seed/think-grow/400/300",
    thumbnail: "https://picsum.photos/seed/think-grow-thumb/200/200",
    images: [
      "https://picsum.photos/seed/think-grow1/400/300",
      "https://picsum.photos/seed/think-grow2/400/300",
      "https://picsum.photos/seed/think-grow3/400/300",
      "https://picsum.photos/seed/think-grow4/400/300"
    ],
    category: "Books",
    brand: "Fawcett",
    rating: 4.5,
    reviewCount: 9012,
    stock: 280,
    features: ["Paperback", "238 Pages", "Success"],
    specifications: {
      "Author": "Napoleon Hill",
      "Pages": "238",
      "Format": "Paperback"
    },
    sku: generateSKU("Books", 8),
    availability: "In Stock",
    tags: ["Success", "Motivation", "Classic"]
  },
  {
    name: "The Lean Startup",
    description: "How today's entrepreneurs use continuous innovation to create radically successful businesses.",
    price: 21.99,
    originalPrice: 34.99,
    discountPercentage: 37,
    image: "https://picsum.photos/seed/lean-startup/400/300",
    thumbnail: "https://picsum.photos/seed/lean-startup-thumb/200/200",
    images: [
      "https://picsum.photos/seed/lean-startup1/400/300",
      "https://picsum.photos/seed/lean-startup2/400/300",
      "https://picsum.photos/seed/lean-startup3/400/300",
      "https://picsum.photos/seed/lean-startup4/400/300"
    ],
    category: "Books",
    brand: "Crown Business",
    rating: 4.6,
    reviewCount: 5432,
    stock: 150,
    features: ["Hardcover", "336 Pages", "Business"],
    specifications: {
      "Author": "Eric Ries",
      "Pages": "336",
      "Format": "Hardcover"
    },
    sku: generateSKU("Books", 9),
    availability: "In Stock",
    tags: ["Business", "Startup", "Innovation"]
  },
  {
    name: "Harry Potter Collection",
    description: "Complete box set of all 7 Harry Potter books, perfect for fans and collectors.",
    price: 79.99,
    originalPrice: 129.99,
    discountPercentage: 38,
    image: "https://picsum.photos/seed/harry-potter/400/300",
    thumbnail: "https://picsum.photos/seed/harry-potter-thumb/200/200",
    images: [
      "https://picsum.photos/seed/harry-potter1/400/300",
      "https://picsum.photos/seed/harry-potter2/400/300",
      "https://picsum.photos/seed/harry-potter3/400/300",
      "https://picsum.photos/seed/harry-potter4/400/300"
    ],
    category: "Books",
    brand: "Scholastic",
    rating: 4.9,
    reviewCount: 12345,
    stock: 90,
    features: ["Box Set", "7 Books", "Hardcover"],
    specifications: {
      "Author": "J.K. Rowling",
      "Books": "7",
      "Format": "Hardcover"
    },
    sku: generateSKU("Books", 10),
    availability: "In Stock",
    tags: ["Fiction", "Fantasy", "Children"]
  },

  // SPORTS (10 products)
  {
    name: "Yoga Mat Premium",
    description: "Extra thick non-slip yoga mat for comfortable workouts at home or the gym, with carrying strap.",
    price: 29.99,
    originalPrice: 44.99,
    discountPercentage: 33,
    image: "https://picsum.photos/seed/yoga-mat/400/300",
    thumbnail: "https://picsum.photos/seed/yoga-mat-thumb/200/200",
    images: [
      "https://picsum.photos/seed/yoga-mat1/400/300",
      "https://picsum.photos/seed/yoga-mat2/400/300",
      "https://picsum.photos/seed/yoga-mat3/400/300",
      "https://picsum.photos/seed/yoga-mat4/400/300"
    ],
    category: "Sports",
    brand: "FitnessPro",
    rating: 4.6,
    reviewCount: 567,
    stock: 120,
    features: ["Extra Thick", "Non-Slip", "Carrying Strap"],
    specifications: {
      "Thickness": "8mm",
      "Length": "72\"",
      "Material": "TPE"
    },
    sku: generateSKU("Sports", 1),
    availability: "In Stock",
    tags: ["Yoga", "Fitness", "Exercise"]
  },
  {
    name: "Football",
    description: "Official size composite leather football with durable laces, perfect for recreational play.",
    price: 24.99,
    originalPrice: 39.99,
    discountPercentage: 37,
    image: "https://picsum.photos/seed/football/400/300",
    thumbnail: "https://picsum.photos/seed/football-thumb/200/200",
    images: [
      "https://picsum.photos/seed/football1/400/300",
      "https://picsum.photos/seed/football2/400/300",
      "https://picsum.photos/seed/football3/400/300",
      "https://picsum.photos/seed/football4/400/300"
    ],
    category: "Sports",
    brand: "ProSports",
    rating: 4.4,
    reviewCount: 345,
    stock: 100,
    features: ["Official Size", "Composite Leather", "Durable Laces"],
    specifications: {
      "Size": "Official",
      "Material": "Composite",
      "Weight": "14-15 oz"
    },
    sku: generateSKU("Sports", 2),
    availability: "In Stock",
    tags: ["Football", "Sports", "Outdoor"]
  },
  {
    name: "Basketball",
    description: "Indoor/outdoor composite basketball with deep channels for improved grip and control.",
    price: 29.99,
    originalPrice: 44.99,
    discountPercentage: 33,
    image: "https://picsum.photos/seed/basketball/400/300",
    thumbnail: "https://picsum.photos/seed/basketball-thumb/200/200",
    images: [
      "https://picsum.photos/seed/basketball1/400/300",
      "https://picsum.photos/seed/basketball2/400/300",
      "https://picsum.photos/seed/basketball3/400/300",
      "https://picsum.photos/seed/basketball4/400/300"
    ],
    category: "Sports",
    brand: "ProSports",
    rating: 4.5,
    reviewCount: 456,
    stock: 110,
    features: ["Indoor/Outdoor", "Composite", "Deep Channels"],
    specifications: {
      "Size": "7",
      "Material": "Composite",
      "Surface": "Indoor/Outdoor"
    },
    sku: generateSKU("Sports", 3),
    availability: "In Stock",
    tags: ["Basketball", "Sports", "Indoor"]
  },
  {
    name: "Cricket Bat",
    description: "Kashmir willow cricket bat with traditional shape, lightweight design, and comfortable grip.",
    price: 69.99,
    originalPrice: 99.99,
    discountPercentage: 30,
    image: "https://picsum.photos/seed/cricket-bat/400/300",
    thumbnail: "https://picsum.photos/seed/cricket-bat-thumb/200/200",
    images: [
      "https://picsum.photos/seed/cricket-bat1/400/300",
      "https://picsum.photos/seed/cricket-bat2/400/300",
      "https://picsum.photos/seed/cricket-bat3/400/300",
      "https://picsum.photos/seed/cricket-bat4/400/300"
    ],
    category: "Sports",
    brand: "CricketPro",
    rating: 4.3,
    reviewCount: 234,
    stock: 70,
    features: ["Kashmir Willow", "Traditional Shape", "Comfortable Grip"],
    specifications: {
      "Material": "Kashmir Willow",
      "Size": "SH",
      "Weight": "2.8 lbs"
    },
    sku: generateSKU("Sports", 4),
    availability: "In Stock",
    tags: ["Cricket", "Bat", "Sports"]
  },
  {
    name: "Dumbbells",
    description: "Set of 2 adjustable dumbbells (5-25 lbs each) with easy weight selection, perfect for home workouts.",
    price: 99.99,
    originalPrice: 149.99,
    discountPercentage: 33,
    image: "https://picsum.photos/seed/dumbbells/400/300",
    thumbnail: "https://picsum.photos/seed/dumbbells-thumb/200/200",
    images: [
      "https://picsum.photos/seed/dumbbells1/400/300",
      "https://picsum.photos/seed/dumbbells2/400/300",
      "https://picsum.photos/seed/dumbbells3/400/300",
      "https://picsum.photos/seed/dumbbells4/400/300"
    ],
    category: "Sports",
    brand: "FitnessPro",
    rating: 4.7,
    reviewCount: 678,
    stock: 80,
    features: ["Adjustable", "5-25 lbs", "Set of 2"],
    specifications: {
      "Weight Range": "5-25 lbs",
      "Material": "Rubber Coated",
      "Quantity": "2"
    },
    sku: generateSKU("Sports", 5),
    availability: "In Stock",
    tags: ["Dumbbells", "Weights", "Home Gym"]
  },
  {
    name: "Resistance Bands",
    description: "Set of 5 resistance bands with different tension levels, door anchor, and carrying bag for full-body workouts.",
    price: 19.99,
    originalPrice: 34.99,
    discountPercentage: 43,
    image: "https://picsum.photos/seed/resistance-bands/400/300",
    thumbnail: "https://picsum.photos/seed/resistance-bands-thumb/200/200",
    images: [
      "https://picsum.photos/seed/resistance-bands1/400/300",
      "https://picsum.photos/seed/resistance-bands2/400/300",
      "https://picsum.photos/seed/resistance-bands3/400/300",
      "https://picsum.photos/seed/resistance-bands4/400/300"
    ],
    category: "Sports",
    brand: "FitnessPro",
    rating: 4.4,
    reviewCount: 523,
    stock: 180,
    features: ["5 Tension Levels", "Door Anchor", "Carrying Bag"],
    specifications: {
      "Set Size": "5",
      "Material": "Latex",
      "Tension": "10-50 lbs"
    },
    sku: generateSKU("Sports", 6),
    availability: "In Stock",
    tags: ["Resistance Bands", "Exercise", "Home"]
  },
  {
    name: "Skipping Rope",
    description: "Adjustable speed jump rope with ball bearings for smooth rotation, ideal for cardio and boxing.",
    price: 14.99,
    originalPrice: 24.99,
    discountPercentage: 40,
    image: "https://picsum.photos/seed/skipping-rope/400/300",
    thumbnail: "https://picsum.photos/seed/skipping-rope-thumb/200/200",
    images: [
      "https://picsum.photos/seed/skipping-rope1/400/300",
      "https://picsum.photos/seed/skipping-rope2/400/300",
      "https://picsum.photos/seed/skipping-rope3/400/300",
      "https://picsum.photos/seed/skipping-rope4/400/300"
    ],
    category: "Sports",
    brand: "FitnessPro",
    rating: 4.5,
    reviewCount: 432,
    stock: 200,
    features: ["Adjustable", "Ball Bearings", "Speed Rope"],
    specifications: {
      "Length": "Adjustable",
      "Handle Material": "Plastic",
      "Rope": "Steel Cable"
    },
    sku: generateSKU("Sports", 7),
    availability: "In Stock",
    tags: ["Jump Rope", "Cardio", "Fitness"]
  },
  {
    name: "Tennis Racket",
    description: "Lightweight graphite tennis racket with oversized head for forgiving shots, perfect for beginners.",
    price: 79.99,
    originalPrice: 119.99,
    discountPercentage: 33,
    image: "https://picsum.photos/seed/tennis-racket/400/300",
    thumbnail: "https://picsum.photos/seed/tennis-racket-thumb/200/200",
    images: [
      "https://picsum.photos/seed/tennis-racket1/400/300",
      "https://picsum.photos/seed/tennis-racket2/400/300",
      "https://picsum.photos/seed/tennis-racket3/400/300",
      "https://picsum.photos/seed/tennis-racket4/400/300"
    ],
    category: "Sports",
    brand: "CourtPro",
    rating: 4.3,
    reviewCount: 289,
    stock: 60,
    features: ["Graphite", "Oversized Head", "Beginner Friendly"],
    specifications: {
      "Head Size": "105 sq in",
      "Weight": "10 oz",
      "String Tension": "50-60 lbs"
    },
    sku: generateSKU("Sports", 8),
    availability: "In Stock",
    tags: ["Tennis", "Racket", "Sports"]
  },
  {
    name: "Gym Gloves",
    description: "Breathable gym gloves with wrist support and non-slip palm, ideal for weightlifting and workouts.",
    price: 19.99,
    originalPrice: 29.99,
    discountPercentage: 33,
    image: "https://picsum.photos/seed/gym-gloves/400/300",
    thumbnail: "https://picsum.photos/seed/gym-gloves-thumb/200/200",
    images: [
      "https://picsum.photos/seed/gym-gloves1/400/300",
      "https://picsum.photos/seed/gym-gloves2/400/300",
      "https://picsum.photos/seed/gym-gloves3/400/300",
      "https://picsum.photos/seed/gym-gloves4/400/300"
    ],
    category: "Sports",
    brand: "FitnessPro",
    rating: 4.4,
    reviewCount: 398,
    stock: 150,
    features: ["Breathable", "Wrist Support", "Non-Slip Palm"],
    specifications: {
      "Material": "Neoprene",
      "Sizes": "S/M/L/XL",
      "Care": "Hand Wash"
    },
    sku: generateSKU("Sports", 9),
    availability: "In Stock",
    tags: ["Gloves", "Gym", "Weightlifting"]
  },
  {
    name: "Water Bottle",
    description: "32oz insulated stainless steel water bottle with straw lid, keeps drinks cold for 24 hours.",
    price: 24.99,
    originalPrice: 39.99,
    discountPercentage: 37,
    image: "https://picsum.photos/seed/water-bottle/400/300",
    thumbnail: "https://picsum.photos/seed/water-bottle-thumb/200/200",
    images: [
      "https://picsum.photos/seed/water-bottle1/400/300",
      "https://picsum.photos/seed/water-bottle2/400/300",
      "https://picsum.photos/seed/water-bottle3/400/300",
      "https://picsum.photos/seed/water-bottle4/400/300"
    ],
    category: "Sports",
    brand: "HydroPro",
    rating: 4.7,
    reviewCount: 876,
    stock: 170,
    features: ["32oz", "Insulated", "Straw Lid"],
    specifications: {
      "Capacity": "32oz",
      "Material": "Stainless Steel",
      "Cold Time": "24hrs"
    },
    sku: generateSKU("Sports", 10),
    availability: "In Stock",
    tags: ["Water Bottle", "Hydration", "Sports"]
  }
];

const normalizedProducts = products.map((product) => {
  const image = buildImageUrl(product);
  const thumbnail = image;
  const images = [image, image, image, image];

  return {
    ...product,
    price: toINR(product.price),
    originalPrice: toINR(product.originalPrice),
    image,
    thumbnail,
    images,
  };
});

// Connect to DB and seed products
const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Existing products cleared");

    // Insert new products
    const createdProducts = await Product.insertMany(normalizedProducts);
    console.log(`Successfully seeded ${createdProducts.length} products!`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();
