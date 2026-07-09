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

const buildImageUrl = (product, index = 0) => {
  const query = `${product.category} ${product.name}`.trim();
  // Use lorem picsum with fixed seeds for reliability, or source.unsplash
  // Let's use picsum with product name as seed for consistency
  const base = `https://picsum.photos/seed/${encodeURIComponent(product.name.replace(/\s+/g, '-'))}${index > 0 ? index : ''}/400/300`;
  return base;
};

// Sample products data
const products = [
  {
    "name": "Wireless Bluetooth Headphones",
    "description": "High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for work, travel, and music.",
    "price": 99.99,
    "originalPrice": 149.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Wireless%20Bluetooth%20Headphones",
    "thumbnail": "https://via.placeholder.com/200x200?text=Wireless%20Bluetooth%20Headphones",
    "images": [
      "https://via.placeholder.com/400x300?text=Wireless%20Bluetooth%20Headphones",
      "https://via.placeholder.com/400x300?text=Wireless%20Bluetooth%20Headphones",
      "https://via.placeholder.com/400x300?text=Wireless%20Bluetooth%20Headphones",
      "https://via.placeholder.com/400x300?text=Wireless%20Bluetooth%20Headphones"
    ],
    "category": "Electronics",
    "brand": "SoundPro",
    "rating": 4.6,
    "reviewCount": 234,
    "stock": 50,
    "features": [
      "Active Noise Cancellation",
      "30hr Battery",
      "Bluetooth 5.3",
      "Premium Sound"
    ],
    "specifications": {
      "Battery Life": "30 hours",
      "Bluetooth Version": "5.3",
      "Weight": "250g",
      "Color": "Black"
    },
    "sku": "ELE-0001",
    "availability": "In Stock",
    "tags": [
      "Audio",
      "Wireless",
      "Noise Cancelling"
    ]
  },
  {
    "name": "Smart Watch Pro",
    "description": "Feature-rich smartwatch with heart rate monitor, GPS, sleep tracking, and 7-day battery life. Water-resistant up to 50m.",
    "price": 199.99,
    "originalPrice": 299.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Smart%20Watch%20Pro",
    "thumbnail": "https://via.placeholder.com/200x200?text=Smart%20Watch%20Pro",
    "images": [
      "https://via.placeholder.com/400x300?text=Smart%20Watch%20Pro",
      "https://via.placeholder.com/400x300?text=Smart%20Watch%20Pro",
      "https://via.placeholder.com/400x300?text=Smart%20Watch%20Pro",
      "https://via.placeholder.com/400x300?text=Smart%20Watch%20Pro"
    ],
    "category": "Electronics",
    "brand": "TechGear",
    "rating": 4.4,
    "reviewCount": 456,
    "stock": 35,
    "features": [
      "GPS",
      "Heart Rate Monitor",
      "Sleep Tracking",
      "Water Resistant"
    ],
    "specifications": {
      "Display": "1.4\" AMOLED",
      "Battery Life": "7 days",
      "Water Resistance": "50m",
      "Strap Material": "Silicone"
    },
    "sku": "ELE-0002",
    "availability": "In Stock",
    "tags": [
      "Smartwatch",
      "Wearable",
      "Fitness"
    ]
  },
  {
    "name": "Wireless Earbuds",
    "description": "True wireless earbuds with touch controls, 24-hour total battery life, and clear call quality. Perfect for daily commutes.",
    "price": 49.99,
    "originalPrice": 79.99,
    "discountPercentage": 37,
    "image": "https://via.placeholder.com/400x300?text=Wireless%20Earbuds",
    "thumbnail": "https://via.placeholder.com/200x200?text=Wireless%20Earbuds",
    "images": [
      "https://via.placeholder.com/400x300?text=Wireless%20Earbuds",
      "https://via.placeholder.com/400x300?text=Wireless%20Earbuds",
      "https://via.placeholder.com/400x300?text=Wireless%20Earbuds",
      "https://via.placeholder.com/400x300?text=Wireless%20Earbuds"
    ],
    "category": "Electronics",
    "brand": "SoundPro",
    "rating": 4.5,
    "reviewCount": 189,
    "stock": 80,
    "features": [
      "Touch Controls",
      "24hr Battery",
      "Wireless Charging"
    ],
    "specifications": {
      "Battery per Charge": "6 hours",
      "Total Battery": "24 hours",
      "Charging Case": "Included"
    },
    "sku": "ELE-0003",
    "availability": "In Stock",
    "tags": [
      "Earbuds",
      "Wireless",
      "Audio"
    ]
  },
  {
    "name": "Gaming Keyboard",
    "description": "Mechanical gaming keyboard with RGB backlighting, anti-ghosting, and durable key switches designed for long gaming sessions.",
    "price": 129.99,
    "originalPrice": 179.99,
    "discountPercentage": 28,
    "image": "https://via.placeholder.com/400x300?text=Gaming%20Keyboard",
    "thumbnail": "https://via.placeholder.com/200x200?text=Gaming%20Keyboard",
    "images": [
      "https://via.placeholder.com/400x300?text=Gaming%20Keyboard",
      "https://via.placeholder.com/400x300?text=Gaming%20Keyboard",
      "https://via.placeholder.com/400x300?text=Gaming%20Keyboard",
      "https://via.placeholder.com/400x300?text=Gaming%20Keyboard"
    ],
    "category": "Electronics",
    "brand": "GameX",
    "rating": 4.8,
    "reviewCount": 312,
    "stock": 45,
    "features": [
      "RGB Backlight",
      "Mechanical Switches",
      "Anti-Ghosting"
    ],
    "specifications": {
      "Switch Type": "Cherry MX Red",
      "Key Count": "104",
      "Connection": "USB"
    },
    "sku": "ELE-0004",
    "availability": "In Stock",
    "tags": [
      "Gaming",
      "Keyboard",
      "Mechanical"
    ]
  },
  {
    "name": "Gaming Mouse",
    "description": "Ergonomic gaming mouse with adjustable DPI up to 16000, programmable buttons, and RGB lighting for precision gaming.",
    "price": 59.99,
    "originalPrice": 89.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Gaming%20Mouse",
    "thumbnail": "https://via.placeholder.com/200x200?text=Gaming%20Mouse",
    "images": [
      "https://via.placeholder.com/400x300?text=Gaming%20Mouse",
      "https://via.placeholder.com/400x300?text=Gaming%20Mouse",
      "https://via.placeholder.com/400x300?text=Gaming%20Mouse",
      "https://via.placeholder.com/400x300?text=Gaming%20Mouse"
    ],
    "category": "Electronics",
    "brand": "GameX",
    "rating": 4.7,
    "reviewCount": 256,
    "stock": 60,
    "features": [
      "16000 DPI",
      "Programmable Buttons",
      "RGB Lighting"
    ],
    "specifications": {
      "DPI Range": "200-16000",
      "Buttons": "8",
      "Connection": "USB"
    },
    "sku": "ELE-0005",
    "availability": "In Stock",
    "tags": [
      "Gaming",
      "Mouse",
      "RGB"
    ]
  },
  {
    "name": "Bluetooth Speaker",
    "description": "Portable Bluetooth speaker with 360-degree sound, IPX5 water resistance, and 12-hour battery life for outdoor use.",
    "price": 79.99,
    "originalPrice": 119.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Bluetooth%20Speaker",
    "thumbnail": "https://via.placeholder.com/200x200?text=Bluetooth%20Speaker",
    "images": [
      "https://via.placeholder.com/400x300?text=Bluetooth%20Speaker",
      "https://via.placeholder.com/400x300?text=Bluetooth%20Speaker",
      "https://via.placeholder.com/400x300?text=Bluetooth%20Speaker",
      "https://via.placeholder.com/400x300?text=Bluetooth%20Speaker"
    ],
    "category": "Electronics",
    "brand": "SoundPro",
    "rating": 4.3,
    "reviewCount": 178,
    "stock": 55,
    "features": [
      "360-Degree Sound",
      "IPX5 Water Resistance",
      "12hr Battery"
    ],
    "specifications": {
      "Battery Life": "12 hours",
      "Water Resistance": "IPX5",
      "Weight": "350g"
    },
    "sku": "ELE-0006",
    "availability": "In Stock",
    "tags": [
      "Speaker",
      "Bluetooth",
      "Portable"
    ]
  },
  {
    "name": "Laptop Backpack",
    "description": "Durable laptop backpack with padded compartments for up to 15.6\" laptops, multiple pockets, and water-resistant fabric.",
    "price": 39.99,
    "originalPrice": 59.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Laptop%20Backpack",
    "thumbnail": "https://via.placeholder.com/200x200?text=Laptop%20Backpack",
    "images": [
      "https://via.placeholder.com/400x300?text=Laptop%20Backpack",
      "https://via.placeholder.com/400x300?text=Laptop%20Backpack",
      "https://via.placeholder.com/400x300?text=Laptop%20Backpack",
      "https://via.placeholder.com/400x300?text=Laptop%20Backpack"
    ],
    "category": "Electronics",
    "brand": "TravelMax",
    "rating": 4.4,
    "reviewCount": 423,
    "stock": 100,
    "features": [
      "Fits 15.6\" Laptop",
      "Water Resistant",
      "Multiple Pockets"
    ],
    "specifications": {
      "Laptop Size": "Up to 15.6\"",
      "Material": "Polyester",
      "Capacity": "25L"
    },
    "sku": "ELE-0007",
    "availability": "In Stock",
    "tags": [
      "Backpack",
      "Laptop",
      "Travel"
    ]
  },
  {
    "name": "Power Bank",
    "description": "High-capacity 20000mAh power bank with fast charging, dual USB ports, and LED indicator for on-the-go charging.",
    "price": 34.99,
    "originalPrice": 54.99,
    "discountPercentage": 36,
    "image": "https://via.placeholder.com/400x300?text=Power%20Bank",
    "thumbnail": "https://via.placeholder.com/200x200?text=Power%20Bank",
    "images": [
      "https://via.placeholder.com/400x300?text=Power%20Bank",
      "https://via.placeholder.com/400x300?text=Power%20Bank",
      "https://via.placeholder.com/400x300?text=Power%20Bank",
      "https://via.placeholder.com/400x300?text=Power%20Bank"
    ],
    "category": "Electronics",
    "brand": "ChargeTech",
    "rating": 4.5,
    "reviewCount": 289,
    "stock": 90,
    "features": [
      "20000mAh",
      "Fast Charging",
      "Dual USB Ports"
    ],
    "specifications": {
      "Capacity": "20000mAh",
      "Output": "2.1A",
      "Input": "Micro USB"
    },
    "sku": "ELE-0008",
    "availability": "In Stock",
    "tags": [
      "Power Bank",
      "Portable Charger",
      "Accessories"
    ]
  },
  {
    "name": "AeroSound Pro Wireless Earbuds",
    "description": "Premium true wireless earbuds with active noise cancellation, 36-hour battery life, and spatial audio for immersive sound.",
    "price": 129.99,
    "originalPrice": 179.99,
    "discountPercentage": 28,
    "image": "https://via.placeholder.com/400x300?text=AeroSound%20Pro%20Wireless%20Earbuds",
    "thumbnail": "https://via.placeholder.com/200x200?text=AeroSound%20Pro%20Wireless%20Earbuds",
    "images": [
      "https://via.placeholder.com/400x300?text=AeroSound%20Pro%20Wireless%20Earbuds",
      "https://via.placeholder.com/400x300?text=AeroSound%20Pro%20Wireless%20Earbuds",
      "https://via.placeholder.com/400x300?text=AeroSound%20Pro%20Wireless%20Earbuds",
      "https://via.placeholder.com/400x300?text=AeroSound%20Pro%20Wireless%20Earbuds"
    ],
    "category": "Electronics",
    "brand": "AeroSound",
    "rating": 4.8,
    "reviewCount": 892,
    "stock": 75,
    "features": [
      "Active Noise Cancellation",
      "36hr Battery",
      "Spatial Audio",
      "Wireless Charging"
    ],
    "specifications": {
      "Battery per Charge": "8 hours",
      "Total Battery": "36 hours",
      "Bluetooth Version": "5.3",
      "Water Resistance": "IPX5"
    },
    "sku": "ELE-0009",
    "availability": "In Stock",
    "tags": [
      "Earbuds",
      "Wireless",
      "Audio",
      "Noise Cancelling"
    ]
  },
  {
    "name": "ChronoFit Smart Watch Platinum",
    "description": "Luxury smartwatch with sapphire crystal display, GPS, heart rate monitor, sleep tracking, and 10-day battery life.",
    "price": 299.99,
    "originalPrice": 399.99,
    "discountPercentage": 25,
    "image": "https://via.placeholder.com/400x300?text=ChronoFit%20Smart%20Watch%20Platinum",
    "thumbnail": "https://via.placeholder.com/200x200?text=ChronoFit%20Smart%20Watch%20Platinum",
    "images": [
      "https://via.placeholder.com/400x300?text=ChronoFit%20Smart%20Watch%20Platinum",
      "https://via.placeholder.com/400x300?text=ChronoFit%20Smart%20Watch%20Platinum",
      "https://via.placeholder.com/400x300?text=ChronoFit%20Smart%20Watch%20Platinum",
      "https://via.placeholder.com/400x300?text=ChronoFit%20Smart%20Watch%20Platinum"
    ],
    "category": "Electronics",
    "brand": "ChronoFit",
    "rating": 4.7,
    "reviewCount": 654,
    "stock": 40,
    "features": [
      "Sapphire Crystal Display",
      "GPS",
      "Heart Rate Monitor",
      "Sleep Tracking",
      "10-Day Battery"
    ],
    "specifications": {
      "Display": "1.4\" AMOLED Sapphire",
      "Battery Life": "10 days",
      "Water Resistance": "5ATM",
      "Strap Material": "Leather"
    },
    "sku": "ELE-0010",
    "availability": "In Stock",
    "tags": [
      "Smartwatch",
      "Wearable",
      "Fitness",
      "Luxury"
    ]
  },
  {
    "name": "Cotton T-Shirt",
    "description": "Comfortable 100% cotton t-shirt available in multiple colors. Perfect for everyday wear, casual outings, or lounging at home.",
    "price": 24.99,
    "originalPrice": 34.99,
    "discountPercentage": 29,
    "image": "https://via.placeholder.com/400x300?text=Cotton%20T-Shirt",
    "thumbnail": "https://via.placeholder.com/200x200?text=Cotton%20T-Shirt",
    "images": [
      "https://via.placeholder.com/400x300?text=Cotton%20T-Shirt",
      "https://via.placeholder.com/400x300?text=Cotton%20T-Shirt",
      "https://via.placeholder.com/400x300?text=Cotton%20T-Shirt",
      "https://via.placeholder.com/400x300?text=Cotton%20T-Shirt"
    ],
    "category": "Fashion",
    "brand": "UrbanWear",
    "rating": 4.4,
    "reviewCount": 567,
    "stock": 150,
    "features": [
      "100% Cotton",
      "Multiple Colors",
      "Regular Fit"
    ],
    "specifications": {
      "Material": "100% Cotton",
      "Fit": "Regular",
      "Care": "Machine Washable"
    },
    "sku": "FAS-0001",
    "availability": "In Stock",
    "tags": [
      "T-Shirt",
      "Cotton",
      "Casual"
    ]
  },
  {
    "name": "Polo Shirt",
    "description": "Classic polo shirt made from premium cotton blend, with ribbed collar and cuffs. Suitable for semi-casual occasions.",
    "price": 39.99,
    "originalPrice": 54.99,
    "discountPercentage": 27,
    "image": "https://via.placeholder.com/400x300?text=Polo%20Shirt",
    "thumbnail": "https://via.placeholder.com/200x200?text=Polo%20Shirt",
    "images": [
      "https://via.placeholder.com/400x300?text=Polo%20Shirt",
      "https://via.placeholder.com/400x300?text=Polo%20Shirt",
      "https://via.placeholder.com/400x300?text=Polo%20Shirt",
      "https://via.placeholder.com/400x300?text=Polo%20Shirt"
    ],
    "category": "Fashion",
    "brand": "UrbanWear",
    "rating": 4.3,
    "reviewCount": 345,
    "stock": 120,
    "features": [
      "Ribbed Collar",
      "Cotton Blend",
      "Semi-Casual"
    ],
    "specifications": {
      "Material": "Cotton Blend",
      "Fit": "Classic",
      "Care": "Machine Washable"
    },
    "sku": "FAS-0002",
    "availability": "In Stock",
    "tags": [
      "Polo",
      "Shirt",
      "Semi-Casual"
    ]
  },
  {
    "name": "Denim Jacket",
    "description": "Timeless denim jacket with button closure, multiple pockets, and classic fit. Perfect for layering in any season.",
    "price": 89.99,
    "originalPrice": 129.99,
    "discountPercentage": 31,
    "image": "https://via.placeholder.com/400x300?text=Denim%20Jacket",
    "thumbnail": "https://via.placeholder.com/200x200?text=Denim%20Jacket",
    "images": [
      "https://via.placeholder.com/400x300?text=Denim%20Jacket",
      "https://via.placeholder.com/400x300?text=Denim%20Jacket",
      "https://via.placeholder.com/400x300?text=Denim%20Jacket",
      "https://via.placeholder.com/400x300?text=Denim%20Jacket"
    ],
    "category": "Fashion",
    "brand": "DenimCo",
    "rating": 4.6,
    "reviewCount": 289,
    "stock": 85,
    "features": [
      "Button Closure",
      "Multiple Pockets",
      "Classic Fit"
    ],
    "specifications": {
      "Material": "Cotton Denim",
      "Fit": "Classic",
      "Care": "Machine Washable"
    },
    "sku": "FAS-0003",
    "availability": "In Stock",
    "tags": [
      "Denim",
      "Jacket",
      "Outerwear"
    ]
  },
  {
    "name": "Hoodie",
    "description": "Cozy fleece hoodie with kangaroo pocket, drawstring hood, and ribbed cuffs. Perfect for staying warm in style.",
    "price": 54.99,
    "originalPrice": 79.99,
    "discountPercentage": 31,
    "image": "https://via.placeholder.com/400x300?text=Hoodie",
    "thumbnail": "https://via.placeholder.com/200x200?text=Hoodie",
    "images": [
      "https://via.placeholder.com/400x300?text=Hoodie",
      "https://via.placeholder.com/400x300?text=Hoodie",
      "https://via.placeholder.com/400x300?text=Hoodie",
      "https://via.placeholder.com/400x300?text=Hoodie"
    ],
    "category": "Fashion",
    "brand": "ComfortWear",
    "rating": 4.5,
    "reviewCount": 456,
    "stock": 130,
    "features": [
      "Kangaroo Pocket",
      "Drawstring Hood",
      "Ribbed Cuffs"
    ],
    "specifications": {
      "Material": "Fleece",
      "Fit": "Regular",
      "Care": "Machine Washable"
    },
    "sku": "FAS-0004",
    "availability": "In Stock",
    "tags": [
      "Hoodie",
      "Fleece",
      "Winter"
    ]
  },
  {
    "name": "Jeans",
    "description": "Classic straight-fit jeans made from premium denim, with a modern wash for a stylish look.",
    "price": 69.99,
    "originalPrice": 99.99,
    "discountPercentage": 30,
    "image": "https://via.placeholder.com/400x300?text=Jeans",
    "thumbnail": "https://via.placeholder.com/200x200?text=Jeans",
    "images": [
      "https://via.placeholder.com/400x300?text=Jeans",
      "https://via.placeholder.com/400x300?text=Jeans",
      "https://via.placeholder.com/400x300?text=Jeans",
      "https://via.placeholder.com/400x300?text=Jeans"
    ],
    "category": "Fashion",
    "brand": "DenimCo",
    "rating": 4.4,
    "reviewCount": 523,
    "stock": 110,
    "features": [
      "Straight Fit",
      "Premium Denim",
      "Modern Wash"
    ],
    "specifications": {
      "Material": "Denim",
      "Fit": "Straight",
      "Care": "Machine Washable"
    },
    "sku": "FAS-0005",
    "availability": "In Stock",
    "tags": [
      "Jeans",
      "Denim",
      "Pants"
    ]
  },
  {
    "name": "Chinos",
    "description": "Smart-casual chino pants with slim fit, made from comfortable cotton twill. Perfect for work or weekend.",
    "price": 59.99,
    "originalPrice": 84.99,
    "discountPercentage": 29,
    "image": "https://via.placeholder.com/400x300?text=Chinos",
    "thumbnail": "https://via.placeholder.com/200x200?text=Chinos",
    "images": [
      "https://via.placeholder.com/400x300?text=Chinos",
      "https://via.placeholder.com/400x300?text=Chinos",
      "https://via.placeholder.com/400x300?text=Chinos",
      "https://via.placeholder.com/400x300?text=Chinos"
    ],
    "category": "Fashion",
    "brand": "UrbanWear",
    "rating": 4.3,
    "reviewCount": 298,
    "stock": 95,
    "features": [
      "Slim Fit",
      "Cotton Twill",
      "Smart-Casual"
    ],
    "specifications": {
      "Material": "Cotton Twill",
      "Fit": "Slim",
      "Care": "Machine Washable"
    },
    "sku": "FAS-0006",
    "availability": "In Stock",
    "tags": [
      "Chinos",
      "Pants",
      "Smart-Casual"
    ]
  },
  {
    "name": "Formal Shirt",
    "description": "Crisp formal button-down shirt with spread collar, perfect for office wear or special occasions.",
    "price": 49.99,
    "originalPrice": 69.99,
    "discountPercentage": 29,
    "image": "https://via.placeholder.com/400x300?text=Formal%20Shirt",
    "thumbnail": "https://via.placeholder.com/200x200?text=Formal%20Shirt",
    "images": [
      "https://via.placeholder.com/400x300?text=Formal%20Shirt",
      "https://via.placeholder.com/400x300?text=Formal%20Shirt",
      "https://via.placeholder.com/400x300?text=Formal%20Shirt",
      "https://via.placeholder.com/400x300?text=Formal%20Shirt"
    ],
    "category": "Fashion",
    "brand": "UrbanWear",
    "rating": 4.2,
    "reviewCount": 234,
    "stock": 105,
    "features": [
      "Spread Collar",
      "Button-Down",
      "Formal"
    ],
    "specifications": {
      "Material": "Cotton Blend",
      "Fit": "Regular",
      "Care": "Machine Washable"
    },
    "sku": "FAS-0007",
    "availability": "In Stock",
    "tags": [
      "Formal",
      "Shirt",
      "Office"
    ]
  },
  {
    "name": "Sweatshirt",
    "description": "Soft crew-neck sweatshirt with brushed interior for extra warmth, ideal for casual wear.",
    "price": 44.99,
    "originalPrice": 64.99,
    "discountPercentage": 31,
    "image": "https://via.placeholder.com/400x300?text=Sweatshirt",
    "thumbnail": "https://via.placeholder.com/200x200?text=Sweatshirt",
    "images": [
      "https://via.placeholder.com/400x300?text=Sweatshirt",
      "https://via.placeholder.com/400x300?text=Sweatshirt",
      "https://via.placeholder.com/400x300?text=Sweatshirt",
      "https://via.placeholder.com/400x300?text=Sweatshirt"
    ],
    "category": "Fashion",
    "brand": "ComfortWear",
    "rating": 4.5,
    "reviewCount": 367,
    "stock": 140,
    "features": [
      "Crew-Neck",
      "Brushed Interior",
      "Soft Fabric"
    ],
    "specifications": {
      "Material": "Cotton Blend",
      "Fit": "Regular",
      "Care": "Machine Washable"
    },
    "sku": "FAS-0008",
    "availability": "In Stock",
    "tags": [
      "Sweatshirt",
      "Casual",
      "Winter"
    ]
  },
  {
    "name": "Cargo Pants",
    "description": "Functional cargo pants with multiple pockets, durable fabric, and relaxed fit for outdoor activities.",
    "price": 54.99,
    "originalPrice": 79.99,
    "discountPercentage": 31,
    "image": "https://via.placeholder.com/400x300?text=Cargo%20Pants",
    "thumbnail": "https://via.placeholder.com/200x200?text=Cargo%20Pants",
    "images": [
      "https://via.placeholder.com/400x300?text=Cargo%20Pants",
      "https://via.placeholder.com/400x300?text=Cargo%20Pants",
      "https://via.placeholder.com/400x300?text=Cargo%20Pants",
      "https://via.placeholder.com/400x300?text=Cargo%20Pants"
    ],
    "category": "Fashion",
    "brand": "OutdoorPro",
    "rating": 4.3,
    "reviewCount": 278,
    "stock": 90,
    "features": [
      "Multiple Pockets",
      "Durable Fabric",
      "Relaxed Fit"
    ],
    "specifications": {
      "Material": "Cotton Blend",
      "Fit": "Relaxed",
      "Care": "Machine Washable"
    },
    "sku": "FAS-0009",
    "availability": "In Stock",
    "tags": [
      "Cargo",
      "Pants",
      "Outdoor"
    ]
  },
  {
    "name": "Running Shorts",
    "description": "Lightweight, breathable running shorts with moisture-wicking fabric and built-in liner for comfort during workouts.",
    "price": 29.99,
    "originalPrice": 44.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Running%20Shorts",
    "thumbnail": "https://via.placeholder.com/200x200?text=Running%20Shorts",
    "images": [
      "https://via.placeholder.com/400x300?text=Running%20Shorts",
      "https://via.placeholder.com/400x300?text=Running%20Shorts",
      "https://via.placeholder.com/400x300?text=Running%20Shorts",
      "https://via.placeholder.com/400x300?text=Running%20Shorts"
    ],
    "category": "Fashion",
    "brand": "SportWear",
    "rating": 4.4,
    "reviewCount": 312,
    "stock": 160,
    "features": [
      "Moisture-Wicking",
      "Breathable",
      "Built-in Liner"
    ],
    "specifications": {
      "Material": "Polyester Blend",
      "Fit": "Athletic",
      "Care": "Machine Washable"
    },
    "sku": "FAS-0010",
    "availability": "In Stock",
    "tags": [
      "Shorts",
      "Running",
      "Athletic"
    ]
  },
  {
    "name": "LED Table Lamp",
    "description": "Adjustable LED table lamp with multiple brightness levels and color temperatures for reading and working.",
    "price": 49.99,
    "originalPrice": 69.99,
    "discountPercentage": 29,
    "image": "https://via.placeholder.com/400x300?text=LED%20Table%20Lamp",
    "thumbnail": "https://via.placeholder.com/200x200?text=LED%20Table%20Lamp",
    "images": [
      "https://via.placeholder.com/400x300?text=LED%20Table%20Lamp",
      "https://via.placeholder.com/400x300?text=LED%20Table%20Lamp",
      "https://via.placeholder.com/400x300?text=LED%20Table%20Lamp",
      "https://via.placeholder.com/400x300?text=LED%20Table%20Lamp"
    ],
    "category": "Home & Kitchen",
    "brand": "BrightHome",
    "rating": 4.5,
    "reviewCount": 389,
    "stock": 100,
    "features": [
      "Adjustable",
      "Multiple Brightness",
      "Color Temperature"
    ],
    "specifications": {
      "Power": "12W",
      "Color Temp": "2700K-6500K",
      "Material": "ABS"
    },
    "sku": "HOM-0001",
    "availability": "In Stock",
    "tags": [
      "Lamp",
      "LED",
      "Home Decor"
    ]
  },
  {
    "name": "Coffee Maker",
    "description": "Programmable drip coffee maker with 12-cup capacity, auto-shutoff, and reusable filter for daily coffee brewing.",
    "price": 69.99,
    "originalPrice": 99.99,
    "discountPercentage": 30,
    "image": "https://via.placeholder.com/400x300?text=Coffee%20Maker",
    "thumbnail": "https://via.placeholder.com/200x200?text=Coffee%20Maker",
    "images": [
      "https://via.placeholder.com/400x300?text=Coffee%20Maker",
      "https://via.placeholder.com/400x300?text=Coffee%20Maker",
      "https://via.placeholder.com/400x300?text=Coffee%20Maker",
      "https://via.placeholder.com/400x300?text=Coffee%20Maker"
    ],
    "category": "Home & Kitchen",
    "brand": "KitchenPro",
    "rating": 4.4,
    "reviewCount": 256,
    "stock": 80,
    "features": [
      "12-Cup",
      "Programmable",
      "Reusable Filter"
    ],
    "specifications": {
      "Capacity": "12 Cups",
      "Power": "900W",
      "Material": "Stainless Steel"
    },
    "sku": "HOM-0002",
    "availability": "In Stock",
    "tags": [
      "Coffee Maker",
      "Kitchen",
      "Appliance"
    ]
  },
  {
    "name": "Vacuum Cleaner",
    "description": "Bagless upright vacuum cleaner with HEPA filter, strong suction, and multiple attachments for carpets and floors.",
    "price": 149.99,
    "originalPrice": 199.99,
    "discountPercentage": 25,
    "image": "https://via.placeholder.com/400x300?text=Vacuum%20Cleaner",
    "thumbnail": "https://via.placeholder.com/200x200?text=Vacuum%20Cleaner",
    "images": [
      "https://via.placeholder.com/400x300?text=Vacuum%20Cleaner",
      "https://via.placeholder.com/400x300?text=Vacuum%20Cleaner",
      "https://via.placeholder.com/400x300?text=Vacuum%20Cleaner",
      "https://via.placeholder.com/400x300?text=Vacuum%20Cleaner"
    ],
    "category": "Home & Kitchen",
    "brand": "CleanTech",
    "rating": 4.3,
    "reviewCount": 198,
    "stock": 60,
    "features": [
      "Bagless",
      "HEPA Filter",
      "Strong Suction"
    ],
    "specifications": {
      "Power": "1600W",
      "Filter": "HEPA",
      "Capacity": "2.5L"
    },
    "sku": "HOM-0003",
    "availability": "In Stock",
    "tags": [
      "Vacuum",
      "Cleaning",
      "Home"
    ]
  },
  {
    "name": "Air Fryer",
    "description": "5.5-quart air fryer with digital controls, 8 preset cooking functions, and easy-to-clean non-stick basket.",
    "price": 99.99,
    "originalPrice": 139.99,
    "discountPercentage": 29,
    "image": "https://via.placeholder.com/400x300?text=Air%20Fryer",
    "thumbnail": "https://via.placeholder.com/200x200?text=Air%20Fryer",
    "images": [
      "https://via.placeholder.com/400x300?text=Air%20Fryer",
      "https://via.placeholder.com/400x300?text=Air%20Fryer",
      "https://via.placeholder.com/400x300?text=Air%20Fryer",
      "https://via.placeholder.com/400x300?text=Air%20Fryer"
    ],
    "category": "Home & Kitchen",
    "brand": "KitchenPro",
    "rating": 4.6,
    "reviewCount": 423,
    "stock": 70,
    "features": [
      "5.5-Quart",
      "Digital Controls",
      "8 Preset Functions"
    ],
    "specifications": {
      "Capacity": "5.5L",
      "Power": "1700W",
      "Temp Range": "170-400°F"
    },
    "sku": "HOM-0004",
    "availability": "In Stock",
    "tags": [
      "Air Fryer",
      "Kitchen",
      "Appliance"
    ]
  },
  {
    "name": "Blender",
    "description": "1000W high-performance blender with 6-speed settings, pulse function, and 64oz BPA-free jar.",
    "price": 79.99,
    "originalPrice": 114.99,
    "discountPercentage": 30,
    "image": "https://via.placeholder.com/400x300?text=Blender",
    "thumbnail": "https://via.placeholder.com/200x200?text=Blender",
    "images": [
      "https://via.placeholder.com/400x300?text=Blender",
      "https://via.placeholder.com/400x300?text=Blender",
      "https://via.placeholder.com/400x300?text=Blender",
      "https://via.placeholder.com/400x300?text=Blender"
    ],
    "category": "Home & Kitchen",
    "brand": "KitchenPro",
    "rating": 4.4,
    "reviewCount": 345,
    "stock": 85,
    "features": [
      "1000W",
      "6-Speed",
      "Pulse Function"
    ],
    "specifications": {
      "Power": "1000W",
      "Capacity": "64oz",
      "Jar Material": "Tritan"
    },
    "sku": "HOM-0005",
    "availability": "In Stock",
    "tags": [
      "Blender",
      "Kitchen",
      "Appliance"
    ]
  },
  {
    "name": "Wall Clock",
    "description": "Modern minimalist wall clock with silent sweep movement, easy-to-read large numerals.",
    "price": 29.99,
    "originalPrice": 44.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Wall%20Clock",
    "thumbnail": "https://via.placeholder.com/200x200?text=Wall%20Clock",
    "images": [
      "https://via.placeholder.com/400x300?text=Wall%20Clock",
      "https://via.placeholder.com/400x300?text=Wall%20Clock",
      "https://via.placeholder.com/400x300?text=Wall%20Clock",
      "https://via.placeholder.com/400x300?text=Wall%20Clock"
    ],
    "category": "Home & Kitchen",
    "brand": "TimeMaster",
    "rating": 4.3,
    "reviewCount": 234,
    "stock": 120,
    "features": [
      "Silent Sweep",
      "Large Numerals",
      "Minimalist Design"
    ],
    "specifications": {
      "Diameter": "12\"",
      "Movement": "Quartz",
      "Material": "Plastic"
    },
    "sku": "HOM-0006",
    "availability": "In Stock",
    "tags": [
      "Clock",
      "Home Decor",
      "Wall"
    ]
  },
  {
    "name": "Storage Basket",
    "description": "Set of 3 woven storage baskets in different sizes, perfect for organizing clothes, toys, or blankets.",
    "price": 39.99,
    "originalPrice": 59.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Storage%20Basket",
    "thumbnail": "https://via.placeholder.com/200x200?text=Storage%20Basket",
    "images": [
      "https://via.placeholder.com/400x300?text=Storage%20Basket",
      "https://via.placeholder.com/400x300?text=Storage%20Basket",
      "https://via.placeholder.com/400x300?text=Storage%20Basket",
      "https://via.placeholder.com/400x300?text=Storage%20Basket"
    ],
    "category": "Home & Kitchen",
    "brand": "OrganizeIt",
    "rating": 4.5,
    "reviewCount": 312,
    "stock": 150,
    "features": [
      "Set of 3",
      "Woven",
      "Different Sizes"
    ],
    "specifications": {
      "Material": "Woven",
      "Sizes": "Small/Medium/Large",
      "Color": "Natural"
    },
    "sku": "HOM-0007",
    "availability": "In Stock",
    "tags": [
      "Storage",
      "Basket",
      "Home"
    ]
  },
  {
    "name": "Bed Sheet Set",
    "description": "Soft microfiber bed sheet set with deep pockets, wrinkle-resistant, available in multiple colors.",
    "price": 49.99,
    "originalPrice": 74.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Bed%20Sheet%20Set",
    "thumbnail": "https://via.placeholder.com/200x200?text=Bed%20Sheet%20Set",
    "images": [
      "https://via.placeholder.com/400x300?text=Bed%20Sheet%20Set",
      "https://via.placeholder.com/400x300?text=Bed%20Sheet%20Set",
      "https://via.placeholder.com/400x300?text=Bed%20Sheet%20Set",
      "https://via.placeholder.com/400x300?text=Bed%20Sheet%20Set"
    ],
    "category": "Home & Kitchen",
    "brand": "SleepWell",
    "rating": 4.6,
    "reviewCount": 456,
    "stock": 130,
    "features": [
      "Deep Pockets",
      "Wrinkle-Resistant",
      "Microfiber"
    ],
    "specifications": {
      "Material": "Microfiber",
      "Size": "Queen",
      "Pocket Depth": "15\""
    },
    "sku": "HOM-0008",
    "availability": "In Stock",
    "tags": [
      "Bed Sheets",
      "Bedding",
      "Home"
    ]
  },
  {
    "name": "Dining Chair",
    "description": "Set of 2 modern dining chairs with padded seats and sturdy wooden legs, perfect for kitchen or dining room.",
    "price": 129.99,
    "originalPrice": 179.99,
    "discountPercentage": 28,
    "image": "https://via.placeholder.com/400x300?text=Dining%20Chair",
    "thumbnail": "https://via.placeholder.com/200x200?text=Dining%20Chair",
    "images": [
      "https://via.placeholder.com/400x300?text=Dining%20Chair",
      "https://via.placeholder.com/400x300?text=Dining%20Chair",
      "https://via.placeholder.com/400x300?text=Dining%20Chair",
      "https://via.placeholder.com/400x300?text=Dining%20Chair"
    ],
    "category": "Home & Kitchen",
    "brand": "HomeFurniture",
    "rating": 4.4,
    "reviewCount": 189,
    "stock": 45,
    "features": [
      "Set of 2",
      "Padded Seats",
      "Wooden Legs"
    ],
    "specifications": {
      "Material": "Fabric/Wood",
      "Weight Capacity": "250 lbs",
      "Height": "18\""
    },
    "sku": "HOM-0009",
    "availability": "In Stock",
    "tags": [
      "Chair",
      "Dining",
      "Furniture"
    ]
  },
  {
    "name": "Kitchen Organizer",
    "description": "Stackable kitchen organizer set with clear plastic bins for storing spices, snacks, or pantry items.",
    "price": 34.99,
    "originalPrice": 49.99,
    "discountPercentage": 30,
    "image": "https://via.placeholder.com/400x300?text=Kitchen%20Organizer",
    "thumbnail": "https://via.placeholder.com/200x200?text=Kitchen%20Organizer",
    "images": [
      "https://via.placeholder.com/400x300?text=Kitchen%20Organizer",
      "https://via.placeholder.com/400x300?text=Kitchen%20Organizer",
      "https://via.placeholder.com/400x300?text=Kitchen%20Organizer",
      "https://via.placeholder.com/400x300?text=Kitchen%20Organizer"
    ],
    "category": "Home & Kitchen",
    "brand": "OrganizeIt",
    "rating": 4.3,
    "reviewCount": 267,
    "stock": 110,
    "features": [
      "Stackable",
      "Clear Plastic",
      "Multiple Sizes"
    ],
    "specifications": {
      "Material": "Plastic",
      "Set Size": "6-Piece",
      "BPA Free": "Yes"
    },
    "sku": "HOM-0010",
    "availability": "In Stock",
    "tags": [
      "Organizer",
      "Kitchen",
      "Storage"
    ]
  },
  {
    "name": "Atomic Habits",
    "description": "A groundbreaking guide to building good habits and breaking bad ones, with practical strategies for daily improvement.",
    "price": 14.99,
    "originalPrice": 24.99,
    "discountPercentage": 40,
    "image": "https://via.placeholder.com/400x300?text=Atomic%20Habits",
    "thumbnail": "https://via.placeholder.com/200x200?text=Atomic%20Habits",
    "images": [
      "https://via.placeholder.com/400x300?text=Atomic%20Habits",
      "https://via.placeholder.com/400x300?text=Atomic%20Habits",
      "https://via.placeholder.com/400x300?text=Atomic%20Habits",
      "https://via.placeholder.com/400x300?text=Atomic%20Habits"
    ],
    "category": "Books",
    "brand": "Penguin",
    "rating": 4.8,
    "reviewCount": 5678,
    "stock": 200,
    "features": [
      "Hardcover",
      "320 Pages",
      "Bestseller"
    ],
    "specifications": {
      "Author": "James Clear",
      "Pages": "320",
      "Format": "Hardcover"
    },
    "sku": "BOO-0001",
    "availability": "In Stock",
    "tags": [
      "Self-Help",
      "Productivity",
      "Bestseller"
    ]
  },
  {
    "name": "The Psychology of Money",
    "description": "Explores the psychology behind financial decisions, helping you make better choices with money.",
    "price": 16.99,
    "originalPrice": 27.99,
    "discountPercentage": 39,
    "image": "https://via.placeholder.com/400x300?text=The%20Psychology%20of%20Money",
    "thumbnail": "https://via.placeholder.com/200x200?text=The%20Psychology%20of%20Money",
    "images": [
      "https://via.placeholder.com/400x300?text=The%20Psychology%20of%20Money",
      "https://via.placeholder.com/400x300?text=The%20Psychology%20of%20Money",
      "https://via.placeholder.com/400x300?text=The%20Psychology%20of%20Money",
      "https://via.placeholder.com/400x300?text=The%20Psychology%20of%20Money"
    ],
    "category": "Books",
    "brand": "HarperCollins",
    "rating": 4.7,
    "reviewCount": 4567,
    "stock": 180,
    "features": [
      "Paperback",
      "272 Pages",
      "Financial"
    ],
    "specifications": {
      "Author": "Morgan Housel",
      "Pages": "272",
      "Format": "Paperback"
    },
    "sku": "BOO-0002",
    "availability": "In Stock",
    "tags": [
      "Finance",
      "Psychology",
      "Bestseller"
    ]
  },
  {
    "name": "Deep Work",
    "description": "Focused work in a distracted world. Rules for success in an age of constant interruption.",
    "price": 15.99,
    "originalPrice": 25.99,
    "discountPercentage": 38,
    "image": "https://via.placeholder.com/400x300?text=Deep%20Work",
    "thumbnail": "https://via.placeholder.com/200x200?text=Deep%20Work",
    "images": [
      "https://via.placeholder.com/400x300?text=Deep%20Work",
      "https://via.placeholder.com/400x300?text=Deep%20Work",
      "https://via.placeholder.com/400x300?text=Deep%20Work",
      "https://via.placeholder.com/400x300?text=Deep%20Work"
    ],
    "category": "Books",
    "brand": "Grand Central",
    "rating": 4.6,
    "reviewCount": 3456,
    "stock": 170,
    "features": [
      "Paperback",
      "296 Pages",
      "Productivity"
    ],
    "specifications": {
      "Author": "Cal Newport",
      "Pages": "296",
      "Format": "Paperback"
    },
    "sku": "BOO-0003",
    "availability": "In Stock",
    "tags": [
      "Productivity",
      "Work",
      "Focus"
    ]
  },
  {
    "name": "Rich Dad Poor Dad",
    "description": "What the rich teach their kids about money that the poor and middle class do not.",
    "price": 12.99,
    "originalPrice": 21.99,
    "discountPercentage": 41,
    "image": "https://via.placeholder.com/400x300?text=Rich%20Dad%20Poor%20Dad",
    "thumbnail": "https://via.placeholder.com/200x200?text=Rich%20Dad%20Poor%20Dad",
    "images": [
      "https://via.placeholder.com/400x300?text=Rich%20Dad%20Poor%20Dad",
      "https://via.placeholder.com/400x300?text=Rich%20Dad%20Poor%20Dad",
      "https://via.placeholder.com/400x300?text=Rich%20Dad%20Poor%20Dad",
      "https://via.placeholder.com/400x300?text=Rich%20Dad%20Poor%20Dad"
    ],
    "category": "Books",
    "brand": "Plata Publishing",
    "rating": 4.4,
    "reviewCount": 7890,
    "stock": 250,
    "features": [
      "Paperback",
      "336 Pages",
      "Personal Finance"
    ],
    "specifications": {
      "Author": "Robert T. Kiyosaki",
      "Pages": "336",
      "Format": "Paperback"
    },
    "sku": "BOO-0004",
    "availability": "In Stock",
    "tags": [
      "Finance",
      "Investing",
      "Personal"
    ]
  },
  {
    "name": "The Alchemist",
    "description": "A magical fable about following your dreams, set in the exotic locales of Spain and Egypt.",
    "price": 13.99,
    "originalPrice": 22.99,
    "discountPercentage": 39,
    "image": "https://via.placeholder.com/400x300?text=The%20Alchemist",
    "thumbnail": "https://via.placeholder.com/200x200?text=The%20Alchemist",
    "images": [
      "https://via.placeholder.com/400x300?text=The%20Alchemist",
      "https://via.placeholder.com/400x300?text=The%20Alchemist",
      "https://via.placeholder.com/400x300?text=The%20Alchemist",
      "https://via.placeholder.com/400x300?text=The%20Alchemist"
    ],
    "category": "Books",
    "brand": "HarperCollins",
    "rating": 4.7,
    "reviewCount": 8901,
    "stock": 220,
    "features": [
      "Paperback",
      "208 Pages",
      "Fiction"
    ],
    "specifications": {
      "Author": "Paulo Coelho",
      "Pages": "208",
      "Format": "Paperback"
    },
    "sku": "BOO-0005",
    "availability": "In Stock",
    "tags": [
      "Fiction",
      "Inspiration",
      "Classic"
    ]
  },
  {
    "name": "Ikigai",
    "description": "The Japanese secret to a long and happy life. Discover your reason for being.",
    "price": 17.99,
    "originalPrice": 28.99,
    "discountPercentage": 38,
    "image": "https://via.placeholder.com/400x300?text=Ikigai",
    "thumbnail": "https://via.placeholder.com/200x200?text=Ikigai",
    "images": [
      "https://via.placeholder.com/400x300?text=Ikigai",
      "https://via.placeholder.com/400x300?text=Ikigai",
      "https://via.placeholder.com/400x300?text=Ikigai",
      "https://via.placeholder.com/400x300?text=Ikigai"
    ],
    "category": "Books",
    "brand": "Penguin",
    "rating": 4.5,
    "reviewCount": 3210,
    "stock": 160,
    "features": [
      "Hardcover",
      "200 Pages",
      "Self-Help"
    ],
    "specifications": {
      "Author": "Ken Mogi",
      "Pages": "200",
      "Format": "Hardcover"
    },
    "sku": "BOO-0006",
    "availability": "In Stock",
    "tags": [
      "Self-Help",
      "Japanese",
      "Life"
    ]
  },
  {
    "name": "Clean Code",
    "description": "A handbook of agile software craftsmanship. Even bad code can function. But if it isn't clean.",
    "price": 44.99,
    "originalPrice": 64.99,
    "discountPercentage": 31,
    "image": "https://via.placeholder.com/400x300?text=Clean%20Code",
    "thumbnail": "https://via.placeholder.com/200x200?text=Clean%20Code",
    "images": [
      "https://via.placeholder.com/400x300?text=Clean%20Code",
      "https://via.placeholder.com/400x300?text=Clean%20Code",
      "https://via.placeholder.com/400x300?text=Clean%20Code",
      "https://via.placeholder.com/400x300?text=Clean%20Code"
    ],
    "category": "Books",
    "brand": "Prentice Hall",
    "rating": 4.7,
    "reviewCount": 6543,
    "stock": 140,
    "features": [
      "Paperback",
      "464 Pages",
      "Programming"
    ],
    "specifications": {
      "Author": "Robert C. Martin",
      "Pages": "464",
      "Format": "Paperback"
    },
    "sku": "BOO-0007",
    "availability": "In Stock",
    "tags": [
      "Programming",
      "Software",
      "Coding"
    ]
  },
  {
    "name": "Think and Grow Rich",
    "description": "The classic bestseller about the power of positive thinking and its role in achieving success.",
    "price": 9.99,
    "originalPrice": 17.99,
    "discountPercentage": 44,
    "image": "https://via.placeholder.com/400x300?text=Think%20and%20Grow%20Rich",
    "thumbnail": "https://via.placeholder.com/200x200?text=Think%20and%20Grow%20Rich",
    "images": [
      "https://via.placeholder.com/400x300?text=Think%20and%20Grow%20Rich",
      "https://via.placeholder.com/400x300?text=Think%20and%20Grow%20Rich",
      "https://via.placeholder.com/400x300?text=Think%20and%20Grow%20Rich",
      "https://via.placeholder.com/400x300?text=Think%20and%20Grow%20Rich"
    ],
    "category": "Books",
    "brand": "Fawcett",
    "rating": 4.5,
    "reviewCount": 9012,
    "stock": 280,
    "features": [
      "Paperback",
      "238 Pages",
      "Success"
    ],
    "specifications": {
      "Author": "Napoleon Hill",
      "Pages": "238",
      "Format": "Paperback"
    },
    "sku": "BOO-0008",
    "availability": "In Stock",
    "tags": [
      "Success",
      "Motivation",
      "Classic"
    ]
  },
  {
    "name": "The Lean Startup",
    "description": "How today's entrepreneurs use continuous innovation to create radically successful businesses.",
    "price": 21.99,
    "originalPrice": 34.99,
    "discountPercentage": 37,
    "image": "https://via.placeholder.com/400x300?text=The%20Lean%20Startup",
    "thumbnail": "https://via.placeholder.com/200x200?text=The%20Lean%20Startup",
    "images": [
      "https://via.placeholder.com/400x300?text=The%20Lean%20Startup",
      "https://via.placeholder.com/400x300?text=The%20Lean%20Startup",
      "https://via.placeholder.com/400x300?text=The%20Lean%20Startup",
      "https://via.placeholder.com/400x300?text=The%20Lean%20Startup"
    ],
    "category": "Books",
    "brand": "Crown Business",
    "rating": 4.6,
    "reviewCount": 5432,
    "stock": 150,
    "features": [
      "Hardcover",
      "336 Pages",
      "Business"
    ],
    "specifications": {
      "Author": "Eric Ries",
      "Pages": "336",
      "Format": "Hardcover"
    },
    "sku": "BOO-0009",
    "availability": "In Stock",
    "tags": [
      "Business",
      "Startup",
      "Innovation"
    ]
  },
  {
    "name": "Harry Potter Collection",
    "description": "Complete box set of all 7 Harry Potter books, perfect for fans and collectors.",
    "price": 79.99,
    "originalPrice": 129.99,
    "discountPercentage": 38,
    "image": "https://via.placeholder.com/400x300?text=Harry%20Potter%20Collection",
    "thumbnail": "https://via.placeholder.com/200x200?text=Harry%20Potter%20Collection",
    "images": [
      "https://via.placeholder.com/400x300?text=Harry%20Potter%20Collection",
      "https://via.placeholder.com/400x300?text=Harry%20Potter%20Collection",
      "https://via.placeholder.com/400x300?text=Harry%20Potter%20Collection",
      "https://via.placeholder.com/400x300?text=Harry%20Potter%20Collection"
    ],
    "category": "Books",
    "brand": "Scholastic",
    "rating": 4.9,
    "reviewCount": 12345,
    "stock": 90,
    "features": [
      "Box Set",
      "7 Books",
      "Hardcover"
    ],
    "specifications": {
      "Author": "J.K. Rowling",
      "Books": "7",
      "Format": "Hardcover"
    },
    "sku": "BOO-0010",
    "availability": "In Stock",
    "tags": [
      "Fiction",
      "Fantasy",
      "Children"
    ]
  },
  {
    "name": "Yoga Mat Premium",
    "description": "Extra thick non-slip yoga mat for comfortable workouts at home or the gym, with carrying strap.",
    "price": 29.99,
    "originalPrice": 44.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Yoga%20Mat%20Premium",
    "thumbnail": "https://via.placeholder.com/200x200?text=Yoga%20Mat%20Premium",
    "images": [
      "https://via.placeholder.com/400x300?text=Yoga%20Mat%20Premium",
      "https://via.placeholder.com/400x300?text=Yoga%20Mat%20Premium",
      "https://via.placeholder.com/400x300?text=Yoga%20Mat%20Premium",
      "https://via.placeholder.com/400x300?text=Yoga%20Mat%20Premium"
    ],
    "category": "Sports & Fitness",
    "brand": "FitnessPro",
    "rating": 4.6,
    "reviewCount": 567,
    "stock": 120,
    "features": [
      "Extra Thick",
      "Non-Slip",
      "Carrying Strap"
    ],
    "specifications": {
      "Thickness": "8mm",
      "Length": "72\"",
      "Material": "TPE"
    },
    "sku": "SPO-0001",
    "availability": "In Stock",
    "tags": [
      "Yoga",
      "Fitness",
      "Exercise"
    ]
  },
  {
    "name": "Football",
    "description": "Official size composite leather football with durable laces, perfect for recreational play.",
    "price": 24.99,
    "originalPrice": 39.99,
    "discountPercentage": 37,
    "image": "https://via.placeholder.com/400x300?text=Football",
    "thumbnail": "https://via.placeholder.com/200x200?text=Football",
    "images": [
      "https://via.placeholder.com/400x300?text=Football",
      "https://via.placeholder.com/400x300?text=Football",
      "https://via.placeholder.com/400x300?text=Football",
      "https://via.placeholder.com/400x300?text=Football"
    ],
    "category": "Sports & Fitness",
    "brand": "ProSports",
    "rating": 4.4,
    "reviewCount": 345,
    "stock": 100,
    "features": [
      "Official Size",
      "Composite Leather",
      "Durable Laces"
    ],
    "specifications": {
      "Size": "Official",
      "Material": "Composite",
      "Weight": "14-15 oz"
    },
    "sku": "SPO-0002",
    "availability": "In Stock",
    "tags": [
      "Football",
      "Sports",
      "Outdoor"
    ]
  },
  {
    "name": "Basketball",
    "description": "Indoor/outdoor composite basketball with deep channels for improved grip and control.",
    "price": 29.99,
    "originalPrice": 44.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Basketball",
    "thumbnail": "https://via.placeholder.com/200x200?text=Basketball",
    "images": [
      "https://via.placeholder.com/400x300?text=Basketball",
      "https://via.placeholder.com/400x300?text=Basketball",
      "https://via.placeholder.com/400x300?text=Basketball",
      "https://via.placeholder.com/400x300?text=Basketball"
    ],
    "category": "Sports & Fitness",
    "brand": "ProSports",
    "rating": 4.5,
    "reviewCount": 456,
    "stock": 110,
    "features": [
      "Indoor/Outdoor",
      "Composite",
      "Deep Channels"
    ],
    "specifications": {
      "Size": "7",
      "Material": "Composite",
      "Surface": "Indoor/Outdoor"
    },
    "sku": "SPO-0003",
    "availability": "In Stock",
    "tags": [
      "Basketball",
      "Sports",
      "Indoor"
    ]
  },
  {
    "name": "Cricket Bat",
    "description": "Kashmir willow cricket bat with traditional shape, lightweight design, and comfortable grip.",
    "price": 69.99,
    "originalPrice": 99.99,
    "discountPercentage": 30,
    "image": "https://via.placeholder.com/400x300?text=Cricket%20Bat",
    "thumbnail": "https://via.placeholder.com/200x200?text=Cricket%20Bat",
    "images": [
      "https://via.placeholder.com/400x300?text=Cricket%20Bat",
      "https://via.placeholder.com/400x300?text=Cricket%20Bat",
      "https://via.placeholder.com/400x300?text=Cricket%20Bat",
      "https://via.placeholder.com/400x300?text=Cricket%20Bat"
    ],
    "category": "Sports & Fitness",
    "brand": "CricketPro",
    "rating": 4.3,
    "reviewCount": 234,
    "stock": 70,
    "features": [
      "Kashmir Willow",
      "Traditional Shape",
      "Comfortable Grip"
    ],
    "specifications": {
      "Material": "Kashmir Willow",
      "Size": "SH",
      "Weight": "2.8 lbs"
    },
    "sku": "SPO-0004",
    "availability": "In Stock",
    "tags": [
      "Cricket",
      "Bat",
      "Sports"
    ]
  },
  {
    "name": "Dumbbells",
    "description": "Set of 2 adjustable dumbbells (5-25 lbs each) with easy weight selection, perfect for home workouts.",
    "price": 99.99,
    "originalPrice": 149.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Dumbbells",
    "thumbnail": "https://via.placeholder.com/200x200?text=Dumbbells",
    "images": [
      "https://via.placeholder.com/400x300?text=Dumbbells",
      "https://via.placeholder.com/400x300?text=Dumbbells",
      "https://via.placeholder.com/400x300?text=Dumbbells",
      "https://via.placeholder.com/400x300?text=Dumbbells"
    ],
    "category": "Sports & Fitness",
    "brand": "FitnessPro",
    "rating": 4.7,
    "reviewCount": 678,
    "stock": 80,
    "features": [
      "Adjustable",
      "5-25 lbs",
      "Set of 2"
    ],
    "specifications": {
      "Weight Range": "5-25 lbs",
      "Material": "Rubber Coated",
      "Quantity": "2"
    },
    "sku": "SPO-0005",
    "availability": "In Stock",
    "tags": [
      "Dumbbells",
      "Weights",
      "Home Gym"
    ]
  },
  {
    "name": "Resistance Bands",
    "description": "Set of 5 resistance bands with different tension levels, door anchor, and carrying bag for full-body workouts.",
    "price": 19.99,
    "originalPrice": 34.99,
    "discountPercentage": 43,
    "image": "https://via.placeholder.com/400x300?text=Resistance%20Bands",
    "thumbnail": "https://via.placeholder.com/200x200?text=Resistance%20Bands",
    "images": [
      "https://via.placeholder.com/400x300?text=Resistance%20Bands",
      "https://via.placeholder.com/400x300?text=Resistance%20Bands",
      "https://via.placeholder.com/400x300?text=Resistance%20Bands",
      "https://via.placeholder.com/400x300?text=Resistance%20Bands"
    ],
    "category": "Sports & Fitness",
    "brand": "FitnessPro",
    "rating": 4.4,
    "reviewCount": 523,
    "stock": 180,
    "features": [
      "5 Tension Levels",
      "Door Anchor",
      "Carrying Bag"
    ],
    "specifications": {
      "Set Size": "5",
      "Material": "Latex",
      "Tension": "10-50 lbs"
    },
    "sku": "SPO-0006",
    "availability": "In Stock",
    "tags": [
      "Resistance Bands",
      "Exercise",
      "Home"
    ]
  },
  {
    "name": "Skipping Rope",
    "description": "Adjustable speed jump rope with ball bearings for smooth rotation, ideal for cardio and boxing.",
    "price": 14.99,
    "originalPrice": 24.99,
    "discountPercentage": 40,
    "image": "https://via.placeholder.com/400x300?text=Skipping%20Rope",
    "thumbnail": "https://via.placeholder.com/200x200?text=Skipping%20Rope",
    "images": [
      "https://via.placeholder.com/400x300?text=Skipping%20Rope",
      "https://via.placeholder.com/400x300?text=Skipping%20Rope",
      "https://via.placeholder.com/400x300?text=Skipping%20Rope",
      "https://via.placeholder.com/400x300?text=Skipping%20Rope"
    ],
    "category": "Sports & Fitness",
    "brand": "FitnessPro",
    "rating": 4.5,
    "reviewCount": 432,
    "stock": 200,
    "features": [
      "Adjustable",
      "Ball Bearings",
      "Speed Rope"
    ],
    "specifications": {
      "Length": "Adjustable",
      "Handle Material": "Plastic",
      "Rope": "Steel Cable"
    },
    "sku": "SPO-0007",
    "availability": "In Stock",
    "tags": [
      "Jump Rope",
      "Cardio",
      "Fitness"
    ]
  },
  {
    "name": "Tennis Racket",
    "description": "Lightweight graphite tennis racket with oversized head for forgiving shots, perfect for beginners.",
    "price": 79.99,
    "originalPrice": 119.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Tennis%20Racket",
    "thumbnail": "https://via.placeholder.com/200x200?text=Tennis%20Racket",
    "images": [
      "https://via.placeholder.com/400x300?text=Tennis%20Racket",
      "https://via.placeholder.com/400x300?text=Tennis%20Racket",
      "https://via.placeholder.com/400x300?text=Tennis%20Racket",
      "https://via.placeholder.com/400x300?text=Tennis%20Racket"
    ],
    "category": "Sports & Fitness",
    "brand": "CourtPro",
    "rating": 4.3,
    "reviewCount": 289,
    "stock": 60,
    "features": [
      "Graphite",
      "Oversized Head",
      "Beginner Friendly"
    ],
    "specifications": {
      "Head Size": "105 sq in",
      "Weight": "10 oz",
      "String Tension": "50-60 lbs"
    },
    "sku": "SPO-0008",
    "availability": "In Stock",
    "tags": [
      "Tennis",
      "Racket",
      "Sports"
    ]
  },
  {
    "name": "Gym Gloves",
    "description": "Breathable gym gloves with wrist support and non-slip palm, ideal for weightlifting and workouts.",
    "price": 19.99,
    "originalPrice": 29.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Gym%20Gloves",
    "thumbnail": "https://via.placeholder.com/200x200?text=Gym%20Gloves",
    "images": [
      "https://via.placeholder.com/400x300?text=Gym%20Gloves",
      "https://via.placeholder.com/400x300?text=Gym%20Gloves",
      "https://via.placeholder.com/400x300?text=Gym%20Gloves",
      "https://via.placeholder.com/400x300?text=Gym%20Gloves"
    ],
    "category": "Sports & Fitness",
    "brand": "FitnessPro",
    "rating": 4.4,
    "reviewCount": 398,
    "stock": 150,
    "features": [
      "Breathable",
      "Wrist Support",
      "Non-Slip Palm"
    ],
    "specifications": {
      "Material": "Neoprene",
      "Sizes": "S/M/L/XL",
      "Care": "Hand Wash"
    },
    "sku": "SPO-0009",
    "availability": "In Stock",
    "tags": [
      "Gloves",
      "Gym",
      "Weightlifting"
    ]
  },
  {
    "name": "Water Bottle",
    "description": "32oz insulated stainless steel water bottle with straw lid, keeps drinks cold for 24 hours.",
    "price": 24.99,
    "originalPrice": 39.99,
    "discountPercentage": 37,
    "image": "https://via.placeholder.com/400x300?text=Water%20Bottle",
    "thumbnail": "https://via.placeholder.com/200x200?text=Water%20Bottle",
    "images": [
      "https://via.placeholder.com/400x300?text=Water%20Bottle",
      "https://via.placeholder.com/400x300?text=Water%20Bottle",
      "https://via.placeholder.com/400x300?text=Water%20Bottle",
      "https://via.placeholder.com/400x300?text=Water%20Bottle"
    ],
    "category": "Sports & Fitness",
    "brand": "HydroPro",
    "rating": 4.7,
    "reviewCount": 876,
    "stock": 170,
    "features": [
      "32oz",
      "Insulated",
      "Straw Lid"
    ],
    "specifications": {
      "Capacity": "32oz",
      "Material": "Stainless Steel",
      "Cold Time": "24hrs"
    },
    "sku": "SPO-0010",
    "availability": "In Stock",
    "tags": [
      "Water Bottle",
      "Hydration",
      "Sports"
    ]
  },
  {
    "name": "Vitamin C Serum",
    "description": "Brightening vitamin C serum with hyaluronic acid for radiant, youthful-looking skin.",
    "price": 29.99,
    "originalPrice": 44.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Vitamin%20C%20Serum",
    "thumbnail": "https://via.placeholder.com/200x200?text=Vitamin%20C%20Serum",
    "images": [
      "https://via.placeholder.com/400x300?text=Vitamin%20C%20Serum",
      "https://via.placeholder.com/400x300?text=Vitamin%20C%20Serum",
      "https://via.placeholder.com/400x300?text=Vitamin%20C%20Serum",
      "https://via.placeholder.com/400x300?text=Vitamin%20C%20Serum"
    ],
    "category": "Beauty & Personal Care",
    "brand": "GlowBeauty",
    "rating": 4.6,
    "reviewCount": 543,
    "stock": 120,
    "features": [
      "Brightening",
      "Hyaluronic Acid",
      "Vitamin C"
    ],
    "specifications": {
      "Volume": "30ml",
      "Skin Type": "All",
      "Cruelty Free": "Yes"
    },
    "sku": "BEA-0001",
    "availability": "In Stock",
    "tags": [
      "Skincare",
      "Serum",
      "Vitamin C"
    ]
  },
  {
    "name": "Moisturizing Face Cream",
    "description": "Hydrating face cream with ceramides for dry skin, provides 24-hour moisture.",
    "price": 24.99,
    "originalPrice": 39.99,
    "discountPercentage": 37,
    "image": "https://via.placeholder.com/400x300?text=Moisturizing%20Face%20Cream",
    "thumbnail": "https://via.placeholder.com/200x200?text=Moisturizing%20Face%20Cream",
    "images": [
      "https://via.placeholder.com/400x300?text=Moisturizing%20Face%20Cream",
      "https://via.placeholder.com/400x300?text=Moisturizing%20Face%20Cream",
      "https://via.placeholder.com/400x300?text=Moisturizing%20Face%20Cream",
      "https://via.placeholder.com/400x300?text=Moisturizing%20Face%20Cream"
    ],
    "category": "Beauty & Personal Care",
    "brand": "GlowBeauty",
    "rating": 4.5,
    "reviewCount": 654,
    "stock": 140,
    "features": [
      "24hr Moisture",
      "Ceramides",
      "Dry Skin"
    ],
    "specifications": {
      "Volume": "50ml",
      "Skin Type": "Dry",
      "Paraben Free": "Yes"
    },
    "sku": "BEA-0002",
    "availability": "In Stock",
    "tags": [
      "Skincare",
      "Moisturizer",
      "Face Cream"
    ]
  },
  {
    "name": "Lipstick Set (12 Colors)",
    "description": "Matte lipstick set with 12 beautiful shades, long-lasting and transfer-resistant.",
    "price": 39.99,
    "originalPrice": 59.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Lipstick%20Set%20(12%20Colors)",
    "thumbnail": "https://via.placeholder.com/200x200?text=Lipstick%20Set%20(12%20Colors)",
    "images": [
      "https://via.placeholder.com/400x300?text=Lipstick%20Set%20(12%20Colors)",
      "https://via.placeholder.com/400x300?text=Lipstick%20Set%20(12%20Colors)",
      "https://via.placeholder.com/400x300?text=Lipstick%20Set%20(12%20Colors)",
      "https://via.placeholder.com/400x300?text=Lipstick%20Set%20(12%20Colors)"
    ],
    "category": "Beauty & Personal Care",
    "brand": "ColorPro",
    "rating": 4.7,
    "reviewCount": 876,
    "stock": 90,
    "features": [
      "12 Shades",
      "Matte",
      "Long-Lasting"
    ],
    "specifications": {
      "Finish": "Matte",
      "Count": "12",
      "Cruelty Free": "Yes"
    },
    "sku": "BEA-0003",
    "availability": "In Stock",
    "tags": [
      "Makeup",
      "Lipstick",
      "Cosmetics"
    ]
  },
  {
    "name": "Mascara Volume & Length",
    "description": "Volumizing and lengthening mascara with curved wand for dramatic lashes.",
    "price": 14.99,
    "originalPrice": 24.99,
    "discountPercentage": 40,
    "image": "https://via.placeholder.com/400x300?text=Mascara%20Volume%20%26%20Length",
    "thumbnail": "https://via.placeholder.com/200x200?text=Mascara%20Volume%20%26%20Length",
    "images": [
      "https://via.placeholder.com/400x300?text=Mascara%20Volume%20%26%20Length",
      "https://via.placeholder.com/400x300?text=Mascara%20Volume%20%26%20Length",
      "https://via.placeholder.com/400x300?text=Mascara%20Volume%20%26%20Length",
      "https://via.placeholder.com/400x300?text=Mascara%20Volume%20%26%20Length"
    ],
    "category": "Beauty & Personal Care",
    "brand": "ColorPro",
    "rating": 4.4,
    "reviewCount": 432,
    "stock": 180,
    "features": [
      "Volumizing",
      "Lengthening",
      "Curved Wand"
    ],
    "specifications": {
      "Color": "Black",
      "Waterproof": "Yes",
      "Paraben Free": "Yes"
    },
    "sku": "BEA-0004",
    "availability": "In Stock",
    "tags": [
      "Makeup",
      "Mascara",
      "Eyes"
    ]
  },
  {
    "name": "Shampoo & Conditioner Set",
    "description": "Nourishing shampoo and conditioner set for all hair types, sulfate-free.",
    "price": 29.99,
    "originalPrice": 44.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Shampoo%20%26%20Conditioner%20Set",
    "thumbnail": "https://via.placeholder.com/200x200?text=Shampoo%20%26%20Conditioner%20Set",
    "images": [
      "https://via.placeholder.com/400x300?text=Shampoo%20%26%20Conditioner%20Set",
      "https://via.placeholder.com/400x300?text=Shampoo%20%26%20Conditioner%20Set",
      "https://via.placeholder.com/400x300?text=Shampoo%20%26%20Conditioner%20Set",
      "https://via.placeholder.com/400x300?text=Shampoo%20%26%20Conditioner%20Set"
    ],
    "category": "Beauty & Personal Care",
    "brand": "HairPro",
    "rating": 4.5,
    "reviewCount": 567,
    "stock": 130,
    "features": [
      "Sulfate-Free",
      "Nourishing",
      "All Hair Types"
    ],
    "specifications": {
      "Volume": "500ml each",
      "Scent": "Coconut",
      "Cruelty Free": "Yes"
    },
    "sku": "BEA-0005",
    "availability": "In Stock",
    "tags": [
      "Haircare",
      "Shampoo",
      "Conditioner"
    ]
  },
  {
    "name": "Facial Cleanser",
    "description": "Gentle foaming facial cleanser for daily use, removes dirt and makeup.",
    "price": 19.99,
    "originalPrice": 29.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Facial%20Cleanser",
    "thumbnail": "https://via.placeholder.com/200x200?text=Facial%20Cleanser",
    "images": [
      "https://via.placeholder.com/400x300?text=Facial%20Cleanser",
      "https://via.placeholder.com/400x300?text=Facial%20Cleanser",
      "https://via.placeholder.com/400x300?text=Facial%20Cleanser",
      "https://via.placeholder.com/400x300?text=Facial%20Cleanser"
    ],
    "category": "Beauty & Personal Care",
    "brand": "GlowBeauty",
    "rating": 4.3,
    "reviewCount": 345,
    "stock": 150,
    "features": [
      "Gentle",
      "Foaming",
      "Makeup Remover"
    ],
    "specifications": {
      "Volume": "150ml",
      "Skin Type": "All",
      "pH Balanced": "Yes"
    },
    "sku": "BEA-0006",
    "availability": "In Stock",
    "tags": [
      "Skincare",
      "Cleanser",
      "Face"
    ]
  },
  {
    "name": "Nail Polish Set (18 Colors)",
    "description": "Trendy nail polish set with 18 colors, quick-drying and chip-resistant.",
    "price": 24.99,
    "originalPrice": 39.99,
    "discountPercentage": 37,
    "image": "https://via.placeholder.com/400x300?text=Nail%20Polish%20Set%20(18%20Colors)",
    "thumbnail": "https://via.placeholder.com/200x200?text=Nail%20Polish%20Set%20(18%20Colors)",
    "images": [
      "https://via.placeholder.com/400x300?text=Nail%20Polish%20Set%20(18%20Colors)",
      "https://via.placeholder.com/400x300?text=Nail%20Polish%20Set%20(18%20Colors)",
      "https://via.placeholder.com/400x300?text=Nail%20Polish%20Set%20(18%20Colors)",
      "https://via.placeholder.com/400x300?text=Nail%20Polish%20Set%20(18%20Colors)"
    ],
    "category": "Beauty & Personal Care",
    "brand": "ColorPro",
    "rating": 4.6,
    "reviewCount": 678,
    "stock": 110,
    "features": [
      "18 Colors",
      "Quick-Drying",
      "Chip-Resistant"
    ],
    "specifications": {
      "Count": "18",
      "Finish": "Variety",
      "Cruelty Free": "Yes"
    },
    "sku": "BEA-0007",
    "availability": "In Stock",
    "tags": [
      "Nails",
      "Nail Polish",
      "Cosmetics"
    ]
  },
  {
    "name": "Perfume (100ml)",
    "description": "Eau de parfum with floral and woody notes, long-lasting fragrance.",
    "price": 59.99,
    "originalPrice": 89.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Perfume%20(100ml)",
    "thumbnail": "https://via.placeholder.com/200x200?text=Perfume%20(100ml)",
    "images": [
      "https://via.placeholder.com/400x300?text=Perfume%20(100ml)",
      "https://via.placeholder.com/400x300?text=Perfume%20(100ml)",
      "https://via.placeholder.com/400x300?text=Perfume%20(100ml)",
      "https://via.placeholder.com/400x300?text=Perfume%20(100ml)"
    ],
    "category": "Beauty & Personal Care",
    "brand": "ScentPro",
    "rating": 4.7,
    "reviewCount": 789,
    "stock": 70,
    "features": [
      "Long-Lasting",
      "Floral",
      "Woody"
    ],
    "specifications": {
      "Volume": "100ml",
      "Type": "Eau de Parfum",
      "Cruelty Free": "Yes"
    },
    "sku": "BEA-0008",
    "availability": "In Stock",
    "tags": [
      "Perfume",
      "Fragrance",
      "Beauty"
    ]
  },
  {
    "name": "Face Mask Set (5 Pack)",
    "description": "Set of 5 sheet masks with different benefits: hydrating, brightening, calming.",
    "price": 19.99,
    "originalPrice": 29.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Face%20Mask%20Set%20(5%20Pack)",
    "thumbnail": "https://via.placeholder.com/200x200?text=Face%20Mask%20Set%20(5%20Pack)",
    "images": [
      "https://via.placeholder.com/400x300?text=Face%20Mask%20Set%20(5%20Pack)",
      "https://via.placeholder.com/400x300?text=Face%20Mask%20Set%20(5%20Pack)",
      "https://via.placeholder.com/400x300?text=Face%20Mask%20Set%20(5%20Pack)",
      "https://via.placeholder.com/400x300?text=Face%20Mask%20Set%20(5%20Pack)"
    ],
    "category": "Beauty & Personal Care",
    "brand": "GlowBeauty",
    "rating": 4.4,
    "reviewCount": 456,
    "stock": 160,
    "features": [
      "5 Pack",
      "Sheet Masks",
      "Variety"
    ],
    "specifications": {
      "Count": "5",
      "Skin Type": "All",
      "Cruelty Free": "Yes"
    },
    "sku": "BEA-0009",
    "availability": "In Stock",
    "tags": [
      "Skincare",
      "Face Mask",
      "Beauty"
    ]
  },
  {
    "name": "Deodorant (Pack of 3)",
    "description": "Aluminum-free deodorant pack, 24-hour odor protection, fresh scent.",
    "price": 19.99,
    "originalPrice": 29.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Deodorant%20(Pack%20of%203)",
    "thumbnail": "https://via.placeholder.com/200x200?text=Deodorant%20(Pack%20of%203)",
    "images": [
      "https://via.placeholder.com/400x300?text=Deodorant%20(Pack%20of%203)",
      "https://via.placeholder.com/400x300?text=Deodorant%20(Pack%20of%203)",
      "https://via.placeholder.com/400x300?text=Deodorant%20(Pack%20of%203)",
      "https://via.placeholder.com/400x300?text=Deodorant%20(Pack%20of%203)"
    ],
    "category": "Beauty & Personal Care",
    "brand": "FreshPro",
    "rating": 4.3,
    "reviewCount": 321,
    "stock": 200,
    "features": [
      "Aluminum-Free",
      "24hr Protection",
      "Pack of 3"
    ],
    "specifications": {
      "Count": "3",
      "Scent": "Fresh",
      "Paraben Free": "Yes"
    },
    "sku": "BEA-0010",
    "availability": "In Stock",
    "tags": [
      "Deodorant",
      "Personal Care",
      "Fresh"
    ]
  },
  {
    "name": "Organic Almonds (1kg)",
    "description": "Premium organic almonds, high in protein and healthy fats, perfect for snacking.",
    "price": 24.99,
    "originalPrice": 34.99,
    "discountPercentage": 29,
    "image": "https://via.placeholder.com/400x300?text=Organic%20Almonds%20(1kg)",
    "thumbnail": "https://via.placeholder.com/200x200?text=Organic%20Almonds%20(1kg)",
    "images": [
      "https://via.placeholder.com/400x300?text=Organic%20Almonds%20(1kg)",
      "https://via.placeholder.com/400x300?text=Organic%20Almonds%20(1kg)",
      "https://via.placeholder.com/400x300?text=Organic%20Almonds%20(1kg)",
      "https://via.placeholder.com/400x300?text=Organic%20Almonds%20(1kg)"
    ],
    "category": "Grocery",
    "brand": "OrganicPro",
    "rating": 4.6,
    "reviewCount": 678,
    "stock": 100,
    "features": [
      "Organic",
      "High Protein",
      "1kg"
    ],
    "specifications": {
      "Weight": "1kg",
      "Organic": "Yes",
      "Gluten Free": "Yes"
    },
    "sku": "GRO-0001",
    "availability": "In Stock",
    "tags": [
      "Nuts",
      "Almonds",
      "Organic"
    ]
  },
  {
    "name": "Greek Yogurt (Pack of 6)",
    "description": "Plain Greek yogurt, high in protein, no added sugar, perfect for breakfast.",
    "price": 14.99,
    "originalPrice": 22.99,
    "discountPercentage": 35,
    "image": "https://via.placeholder.com/400x300?text=Greek%20Yogurt%20(Pack%20of%206)",
    "thumbnail": "https://via.placeholder.com/200x200?text=Greek%20Yogurt%20(Pack%20of%206)",
    "images": [
      "https://via.placeholder.com/400x300?text=Greek%20Yogurt%20(Pack%20of%206)",
      "https://via.placeholder.com/400x300?text=Greek%20Yogurt%20(Pack%20of%206)",
      "https://via.placeholder.com/400x300?text=Greek%20Yogurt%20(Pack%20of%206)",
      "https://via.placeholder.com/400x300?text=Greek%20Yogurt%20(Pack%20of%206)"
    ],
    "category": "Grocery",
    "brand": "DairyPro",
    "rating": 4.5,
    "reviewCount": 543,
    "stock": 120,
    "features": [
      "High Protein",
      "No Added Sugar",
      "Pack of 6"
    ],
    "specifications": {
      "Quantity": "6 x 150g",
      "Flavor": "Plain",
      "Fat": "Low"
    },
    "sku": "GRO-0002",
    "availability": "In Stock",
    "tags": [
      "Yogurt",
      "Dairy",
      "Grocery"
    ]
  },
  {
    "name": "Olive Oil (1L)",
    "description": "Extra virgin olive oil, cold-pressed, perfect for cooking and dressing.",
    "price": 19.99,
    "originalPrice": 29.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Olive%20Oil%20(1L)",
    "thumbnail": "https://via.placeholder.com/200x200?text=Olive%20Oil%20(1L)",
    "images": [
      "https://via.placeholder.com/400x300?text=Olive%20Oil%20(1L)",
      "https://via.placeholder.com/400x300?text=Olive%20Oil%20(1L)",
      "https://via.placeholder.com/400x300?text=Olive%20Oil%20(1L)",
      "https://via.placeholder.com/400x300?text=Olive%20Oil%20(1L)"
    ],
    "category": "Grocery",
    "brand": "OilPro",
    "rating": 4.7,
    "reviewCount": 789,
    "stock": 80,
    "features": [
      "Extra Virgin",
      "Cold-Pressed",
      "1L"
    ],
    "specifications": {
      "Volume": "1L",
      "Type": "Extra Virgin",
      "Origin": "Italy"
    },
    "sku": "GRO-0003",
    "availability": "In Stock",
    "tags": [
      "Olive Oil",
      "Cooking Oil",
      "Grocery"
    ]
  },
  {
    "name": "Coffee Beans (500g)",
    "description": "Premium Arabica coffee beans, medium roast, smooth and rich flavor.",
    "price": 22.99,
    "originalPrice": 34.99,
    "discountPercentage": 34,
    "image": "https://via.placeholder.com/400x300?text=Coffee%20Beans%20(500g)",
    "thumbnail": "https://via.placeholder.com/200x200?text=Coffee%20Beans%20(500g)",
    "images": [
      "https://via.placeholder.com/400x300?text=Coffee%20Beans%20(500g)",
      "https://via.placeholder.com/400x300?text=Coffee%20Beans%20(500g)",
      "https://via.placeholder.com/400x300?text=Coffee%20Beans%20(500g)",
      "https://via.placeholder.com/400x300?text=Coffee%20Beans%20(500g)"
    ],
    "category": "Grocery",
    "brand": "BrewPro",
    "rating": 4.6,
    "reviewCount": 890,
    "stock": 95,
    "features": [
      "Arabica",
      "Medium Roast",
      "500g"
    ],
    "specifications": {
      "Weight": "500g",
      "Roast": "Medium",
      "Type": "Whole Beans"
    },
    "sku": "GRO-0004",
    "availability": "In Stock",
    "tags": [
      "Coffee",
      "Beans",
      "Grocery"
    ]
  },
  {
    "name": "Organic Quinoa (500g)",
    "description": "Organic white quinoa, gluten-free, high in protein, perfect for salads.",
    "price": 12.99,
    "originalPrice": 19.99,
    "discountPercentage": 35,
    "image": "https://via.placeholder.com/400x300?text=Organic%20Quinoa%20(500g)",
    "thumbnail": "https://via.placeholder.com/200x200?text=Organic%20Quinoa%20(500g)",
    "images": [
      "https://via.placeholder.com/400x300?text=Organic%20Quinoa%20(500g)",
      "https://via.placeholder.com/400x300?text=Organic%20Quinoa%20(500g)",
      "https://via.placeholder.com/400x300?text=Organic%20Quinoa%20(500g)",
      "https://via.placeholder.com/400x300?text=Organic%20Quinoa%20(500g)"
    ],
    "category": "Grocery",
    "brand": "OrganicPro",
    "rating": 4.5,
    "reviewCount": 567,
    "stock": 110,
    "features": [
      "Organic",
      "Gluten-Free",
      "High Protein"
    ],
    "specifications": {
      "Weight": "500g",
      "Type": "White",
      "Organic": "Yes"
    },
    "sku": "GRO-0005",
    "availability": "In Stock",
    "tags": [
      "Quinoa",
      "Grain",
      "Organic"
    ]
  },
  {
    "name": "Green Tea (Pack of 100)",
    "description": "Organic green tea bags, antioxidant-rich, helps boost metabolism.",
    "price": 14.99,
    "originalPrice": 22.99,
    "discountPercentage": 35,
    "image": "https://via.placeholder.com/400x300?text=Green%20Tea%20(Pack%20of%20100)",
    "thumbnail": "https://via.placeholder.com/200x200?text=Green%20Tea%20(Pack%20of%20100)",
    "images": [
      "https://via.placeholder.com/400x300?text=Green%20Tea%20(Pack%20of%20100)",
      "https://via.placeholder.com/400x300?text=Green%20Tea%20(Pack%20of%20100)",
      "https://via.placeholder.com/400x300?text=Green%20Tea%20(Pack%20of%20100)",
      "https://via.placeholder.com/400x300?text=Green%20Tea%20(Pack%20of%20100)"
    ],
    "category": "Grocery",
    "brand": "TeaPro",
    "rating": 4.4,
    "reviewCount": 678,
    "stock": 130,
    "features": [
      "Organic",
      "100 Bags",
      "Antioxidant-Rich"
    ],
    "specifications": {
      "Count": "100",
      "Type": "Green Tea",
      "Organic": "Yes"
    },
    "sku": "GRO-0006",
    "availability": "In Stock",
    "tags": [
      "Tea",
      "Green Tea",
      "Grocery"
    ]
  },
  {
    "name": "Dark Chocolate (70%)",
    "description": "Premium dark chocolate with 70% cocoa, rich and indulgent, no added sugar.",
    "price": 9.99,
    "originalPrice": 14.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Dark%20Chocolate%20(70%25)",
    "thumbnail": "https://via.placeholder.com/200x200?text=Dark%20Chocolate%20(70%25)",
    "images": [
      "https://via.placeholder.com/400x300?text=Dark%20Chocolate%20(70%25)",
      "https://via.placeholder.com/400x300?text=Dark%20Chocolate%20(70%25)",
      "https://via.placeholder.com/400x300?text=Dark%20Chocolate%20(70%25)",
      "https://via.placeholder.com/400x300?text=Dark%20Chocolate%20(70%25)"
    ],
    "category": "Grocery",
    "brand": "ChocoPro",
    "rating": 4.7,
    "reviewCount": 789,
    "stock": 150,
    "features": [
      "70% Cocoa",
      "No Added Sugar",
      "Premium"
    ],
    "specifications": {
      "Weight": "100g",
      "Cocoa": "70%",
      "Vegan": "Yes"
    },
    "sku": "GRO-0007",
    "availability": "In Stock",
    "tags": [
      "Chocolate",
      "Dark Chocolate",
      "Grocery"
    ]
  },
  {
    "name": "Honey (500g)",
    "description": "Raw organic honey, unfiltered, from local beekeepers.",
    "price": 18.99,
    "originalPrice": 27.99,
    "discountPercentage": 32,
    "image": "https://via.placeholder.com/400x300?text=Honey%20(500g)",
    "thumbnail": "https://via.placeholder.com/200x200?text=Honey%20(500g)",
    "images": [
      "https://via.placeholder.com/400x300?text=Honey%20(500g)",
      "https://via.placeholder.com/400x300?text=Honey%20(500g)",
      "https://via.placeholder.com/400x300?text=Honey%20(500g)",
      "https://via.placeholder.com/400x300?text=Honey%20(500g)"
    ],
    "category": "Grocery",
    "brand": "HoneyPro",
    "rating": 4.6,
    "reviewCount": 543,
    "stock": 100,
    "features": [
      "Raw",
      "Organic",
      "Unfiltered"
    ],
    "specifications": {
      "Weight": "500g",
      "Organic": "Yes",
      "Local": "Yes"
    },
    "sku": "GRO-0008",
    "availability": "In Stock",
    "tags": [
      "Honey",
      "Sweetener",
      "Organic"
    ]
  },
  {
    "name": "Oats (1kg)",
    "description": "Rolled oats, high in fiber, perfect for breakfast porridge.",
    "price": 8.99,
    "originalPrice": 12.99,
    "discountPercentage": 31,
    "image": "https://via.placeholder.com/400x300?text=Oats%20(1kg)",
    "thumbnail": "https://via.placeholder.com/200x200?text=Oats%20(1kg)",
    "images": [
      "https://via.placeholder.com/400x300?text=Oats%20(1kg)",
      "https://via.placeholder.com/400x300?text=Oats%20(1kg)",
      "https://via.placeholder.com/400x300?text=Oats%20(1kg)",
      "https://via.placeholder.com/400x300?text=Oats%20(1kg)"
    ],
    "category": "Grocery",
    "brand": "GrainPro",
    "rating": 4.5,
    "reviewCount": 678,
    "stock": 180,
    "features": [
      "High Fiber",
      "Rolled Oats",
      "1kg"
    ],
    "specifications": {
      "Weight": "1kg",
      "Type": "Rolled",
      "Gluten Free Option": "Yes"
    },
    "sku": "GRO-0009",
    "availability": "In Stock",
    "tags": [
      "Oats",
      "Breakfast",
      "Grocery"
    ]
  },
  {
    "name": "Almond Milk (1L)",
    "description": "Unsweetened almond milk, dairy-free, perfect for coffee and cereals.",
    "price": 5.99,
    "originalPrice": 8.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Almond%20Milk%20(1L)",
    "thumbnail": "https://via.placeholder.com/200x200?text=Almond%20Milk%20(1L)",
    "images": [
      "https://via.placeholder.com/400x300?text=Almond%20Milk%20(1L)",
      "https://via.placeholder.com/400x300?text=Almond%20Milk%20(1L)",
      "https://via.placeholder.com/400x300?text=Almond%20Milk%20(1L)",
      "https://via.placeholder.com/400x300?text=Almond%20Milk%20(1L)"
    ],
    "category": "Grocery",
    "brand": "PlantPro",
    "rating": 4.4,
    "reviewCount": 567,
    "stock": 140,
    "features": [
      "Dairy-Free",
      "Unsweetened",
      "1L"
    ],
    "specifications": {
      "Volume": "1L",
      "Type": "Almond",
      "Vegan": "Yes"
    },
    "sku": "GRO-0010",
    "availability": "In Stock",
    "tags": [
      "Almond Milk",
      "Plant-Based",
      "Grocery"
    ]
  },
  {
    "name": "Building Blocks Set (1000 Pieces)",
    "description": "Colorful building blocks set for creative play, compatible with major brands.",
    "price": 49.99,
    "originalPrice": 74.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Building%20Blocks%20Set%20(1000%20Pieces)",
    "thumbnail": "https://via.placeholder.com/200x200?text=Building%20Blocks%20Set%20(1000%20Pieces)",
    "images": [
      "https://via.placeholder.com/400x300?text=Building%20Blocks%20Set%20(1000%20Pieces)",
      "https://via.placeholder.com/400x300?text=Building%20Blocks%20Set%20(1000%20Pieces)",
      "https://via.placeholder.com/400x300?text=Building%20Blocks%20Set%20(1000%20Pieces)",
      "https://via.placeholder.com/400x300?text=Building%20Blocks%20Set%20(1000%20Pieces)"
    ],
    "category": "Toys & Games",
    "brand": "ToyPro",
    "rating": 4.7,
    "reviewCount": 890,
    "stock": 80,
    "features": [
      "1000 Pieces",
      "Creative",
      "Compatible"
    ],
    "specifications": {
      "Count": "1000",
      "Age": "6+",
      "Material": "Plastic"
    },
    "sku": "TOY-0001",
    "availability": "In Stock",
    "tags": [
      "Building Blocks",
      "Toys",
      "Creative"
    ]
  },
  {
    "name": "Board Game - Strategy",
    "description": "Award-winning strategy board game, perfect for family game nights.",
    "price": 34.99,
    "originalPrice": 49.99,
    "discountPercentage": 30,
    "image": "https://via.placeholder.com/400x300?text=Board%20Game%20-%20Strategy",
    "thumbnail": "https://via.placeholder.com/200x200?text=Board%20Game%20-%20Strategy",
    "images": [
      "https://via.placeholder.com/400x300?text=Board%20Game%20-%20Strategy",
      "https://via.placeholder.com/400x300?text=Board%20Game%20-%20Strategy",
      "https://via.placeholder.com/400x300?text=Board%20Game%20-%20Strategy",
      "https://via.placeholder.com/400x300?text=Board%20Game%20-%20Strategy"
    ],
    "category": "Toys & Games",
    "brand": "GamePro",
    "rating": 4.8,
    "reviewCount": 1234,
    "stock": 60,
    "features": [
      "Strategy",
      "Family",
      "Awards"
    ],
    "specifications": {
      "Players": "2-4",
      "Play Time": "60-90 min",
      "Age": "12+"
    },
    "sku": "TOY-0002",
    "availability": "In Stock",
    "tags": [
      "Board Game",
      "Strategy",
      "Family"
    ]
  },
  {
    "name": "Remote Control Car",
    "description": "Fast RC car with 2.4GHz remote control, off-road capable.",
    "price": 59.99,
    "originalPrice": 89.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Remote%20Control%20Car",
    "thumbnail": "https://via.placeholder.com/200x200?text=Remote%20Control%20Car",
    "images": [
      "https://via.placeholder.com/400x300?text=Remote%20Control%20Car",
      "https://via.placeholder.com/400x300?text=Remote%20Control%20Car",
      "https://via.placeholder.com/400x300?text=Remote%20Control%20Car",
      "https://via.placeholder.com/400x300?text=Remote%20Control%20Car"
    ],
    "category": "Toys & Games",
    "brand": "ToyPro",
    "rating": 4.6,
    "reviewCount": 765,
    "stock": 70,
    "features": [
      "Fast",
      "2.4GHz",
      "Off-Road"
    ],
    "specifications": {
      "Speed": "20 km/h",
      "Age": "8+",
      "Battery": "Rechargeable"
    },
    "sku": "TOY-0003",
    "availability": "In Stock",
    "tags": [
      "RC Car",
      "Toys",
      "Remote Control"
    ]
  },
  {
    "name": "Teddy Bear (30cm)",
    "description": "Soft and cuddly teddy bear, perfect for kids of all ages.",
    "price": 24.99,
    "originalPrice": 34.99,
    "discountPercentage": 29,
    "image": "https://via.placeholder.com/400x300?text=Teddy%20Bear%20(30cm)",
    "thumbnail": "https://via.placeholder.com/200x200?text=Teddy%20Bear%20(30cm)",
    "images": [
      "https://via.placeholder.com/400x300?text=Teddy%20Bear%20(30cm)",
      "https://via.placeholder.com/400x300?text=Teddy%20Bear%20(30cm)",
      "https://via.placeholder.com/400x300?text=Teddy%20Bear%20(30cm)",
      "https://via.placeholder.com/400x300?text=Teddy%20Bear%20(30cm)"
    ],
    "category": "Toys & Games",
    "brand": "CuddlePro",
    "rating": 4.9,
    "reviewCount": 1111,
    "stock": 150,
    "features": [
      "Soft",
      "Cuddly",
      "30cm"
    ],
    "specifications": {
      "Height": "30cm",
      "Material": "Plush",
      "Washable": "Yes"
    },
    "sku": "TOY-0004",
    "availability": "In Stock",
    "tags": [
      "Teddy Bear",
      "Plush",
      "Toys"
    ]
  },
  {
    "name": "Puzzle (1000 Pieces)",
    "description": "Beautiful landscape puzzle, 1000 pieces, perfect for relaxation.",
    "price": 19.99,
    "originalPrice": 29.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Puzzle%20(1000%20Pieces)",
    "thumbnail": "https://via.placeholder.com/200x200?text=Puzzle%20(1000%20Pieces)",
    "images": [
      "https://via.placeholder.com/400x300?text=Puzzle%20(1000%20Pieces)",
      "https://via.placeholder.com/400x300?text=Puzzle%20(1000%20Pieces)",
      "https://via.placeholder.com/400x300?text=Puzzle%20(1000%20Pieces)",
      "https://via.placeholder.com/400x300?text=Puzzle%20(1000%20Pieces)"
    ],
    "category": "Toys & Games",
    "brand": "PuzzlePro",
    "rating": 4.5,
    "reviewCount": 678,
    "stock": 90,
    "features": [
      "1000 Pieces",
      "Landscape",
      "Relaxing"
    ],
    "specifications": {
      "Count": "1000",
      "Size": "70x50cm",
      "Age": "12+"
    },
    "sku": "TOY-0005",
    "availability": "In Stock",
    "tags": [
      "Puzzle",
      "Jigsaw",
      "Games"
    ]
  },
  {
    "name": "Action Figure Set (5 Pack)",
    "description": "Set of 5 superhero action figures with accessories.",
    "price": 39.99,
    "originalPrice": 59.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Action%20Figure%20Set%20(5%20Pack)",
    "thumbnail": "https://via.placeholder.com/200x200?text=Action%20Figure%20Set%20(5%20Pack)",
    "images": [
      "https://via.placeholder.com/400x300?text=Action%20Figure%20Set%20(5%20Pack)",
      "https://via.placeholder.com/400x300?text=Action%20Figure%20Set%20(5%20Pack)",
      "https://via.placeholder.com/400x300?text=Action%20Figure%20Set%20(5%20Pack)",
      "https://via.placeholder.com/400x300?text=Action%20Figure%20Set%20(5%20Pack)"
    ],
    "category": "Toys & Games",
    "brand": "ToyPro",
    "rating": 4.6,
    "reviewCount": 789,
    "stock": 85,
    "features": [
      "5 Pack",
      "Superhero",
      "Accessories"
    ],
    "specifications": {
      "Count": "5",
      "Height": "15cm",
      "Age": "4+"
    },
    "sku": "TOY-0006",
    "availability": "In Stock",
    "tags": [
      "Action Figures",
      "Toys",
      "Superhero"
    ]
  },
  {
    "name": "Wooden Train Set",
    "description": "Classic wooden train set with tracks and accessories, compatible with major brands.",
    "price": 69.99,
    "originalPrice": 99.99,
    "discountPercentage": 30,
    "image": "https://via.placeholder.com/400x300?text=Wooden%20Train%20Set",
    "thumbnail": "https://via.placeholder.com/200x200?text=Wooden%20Train%20Set",
    "images": [
      "https://via.placeholder.com/400x300?text=Wooden%20Train%20Set",
      "https://via.placeholder.com/400x300?text=Wooden%20Train%20Set",
      "https://via.placeholder.com/400x300?text=Wooden%20Train%20Set",
      "https://via.placeholder.com/400x300?text=Wooden%20Train%20Set"
    ],
    "category": "Toys & Games",
    "brand": "WoodPro",
    "rating": 4.7,
    "reviewCount": 890,
    "stock": 65,
    "features": [
      "Wooden",
      "Tracks",
      "Compatible"
    ],
    "specifications": {
      "Age": "3+",
      "Material": "Wood",
      "Count": "50+ Pieces"
    },
    "sku": "TOY-0007",
    "availability": "In Stock",
    "tags": [
      "Train Set",
      "Wooden",
      "Toys"
    ]
  },
  {
    "name": "Doll Set with Accessories",
    "description": "Beautiful doll set with clothes and accessories for imaginative play.",
    "price": 44.99,
    "originalPrice": 64.99,
    "discountPercentage": 31,
    "image": "https://via.placeholder.com/400x300?text=Doll%20Set%20with%20Accessories",
    "thumbnail": "https://via.placeholder.com/200x200?text=Doll%20Set%20with%20Accessories",
    "images": [
      "https://via.placeholder.com/400x300?text=Doll%20Set%20with%20Accessories",
      "https://via.placeholder.com/400x300?text=Doll%20Set%20with%20Accessories",
      "https://via.placeholder.com/400x300?text=Doll%20Set%20with%20Accessories",
      "https://via.placeholder.com/400x300?text=Doll%20Set%20with%20Accessories"
    ],
    "category": "Toys & Games",
    "brand": "DollPro",
    "rating": 4.6,
    "reviewCount": 654,
    "stock": 75,
    "features": [
      "Doll",
      "Clothes",
      "Accessories"
    ],
    "specifications": {
      "Age": "3+",
      "Height": "30cm",
      "Material": "Vinyl"
    },
    "sku": "TOY-0008",
    "availability": "In Stock",
    "tags": [
      "Doll",
      "Toys",
      "Imaginative Play"
    ]
  },
  {
    "name": "Science Kit for Kids",
    "description": "Educational science kit with 15 experiments, perfect for learning.",
    "price": 39.99,
    "originalPrice": 59.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Science%20Kit%20for%20Kids",
    "thumbnail": "https://via.placeholder.com/200x200?text=Science%20Kit%20for%20Kids",
    "images": [
      "https://via.placeholder.com/400x300?text=Science%20Kit%20for%20Kids",
      "https://via.placeholder.com/400x300?text=Science%20Kit%20for%20Kids",
      "https://via.placeholder.com/400x300?text=Science%20Kit%20for%20Kids",
      "https://via.placeholder.com/400x300?text=Science%20Kit%20for%20Kids"
    ],
    "category": "Toys & Games",
    "brand": "LearnPro",
    "rating": 4.8,
    "reviewCount": 901,
    "stock": 70,
    "features": [
      "Educational",
      "15 Experiments",
      "STEM"
    ],
    "specifications": {
      "Age": "8+",
      "Experiments": "15",
      "STEM": "Yes"
    },
    "sku": "TOY-0009",
    "availability": "In Stock",
    "tags": [
      "Science Kit",
      "Educational",
      "Toys"
    ]
  },
  {
    "name": "Card Game Pack (3 Games)",
    "description": "Set of 3 classic card games: Poker, Go Fish, Uno-style.",
    "price": 14.99,
    "originalPrice": 22.99,
    "discountPercentage": 35,
    "image": "https://via.placeholder.com/400x300?text=Card%20Game%20Pack%20(3%20Games)",
    "thumbnail": "https://via.placeholder.com/200x200?text=Card%20Game%20Pack%20(3%20Games)",
    "images": [
      "https://via.placeholder.com/400x300?text=Card%20Game%20Pack%20(3%20Games)",
      "https://via.placeholder.com/400x300?text=Card%20Game%20Pack%20(3%20Games)",
      "https://via.placeholder.com/400x300?text=Card%20Game%20Pack%20(3%20Games)",
      "https://via.placeholder.com/400x300?text=Card%20Game%20Pack%20(3%20Games)"
    ],
    "category": "Toys & Games",
    "brand": "GamePro",
    "rating": 4.5,
    "reviewCount": 567,
    "stock": 120,
    "features": [
      "3 Games",
      "Classic",
      "Family"
    ],
    "specifications": {
      "Count": "3 Decks",
      "Age": "5+",
      "Players": "2-10"
    },
    "sku": "TOY-0010",
    "availability": "In Stock",
    "tags": [
      "Card Games",
      "Games",
      "Family"
    ]
  },
  {
    "name": "Running Shoes Men's",
    "description": "Lightweight men's running shoes with breathable mesh and cushioned sole.",
    "price": 79.99,
    "originalPrice": 119.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Running%20Shoes%20Men's",
    "thumbnail": "https://via.placeholder.com/200x200?text=Running%20Shoes%20Men's",
    "images": [
      "https://via.placeholder.com/400x300?text=Running%20Shoes%20Men's",
      "https://via.placeholder.com/400x300?text=Running%20Shoes%20Men's",
      "https://via.placeholder.com/400x300?text=Running%20Shoes%20Men's",
      "https://via.placeholder.com/400x300?text=Running%20Shoes%20Men's"
    ],
    "category": "Footwear",
    "brand": "RunPro",
    "rating": 4.6,
    "reviewCount": 789,
    "stock": 80,
    "features": [
      "Lightweight",
      "Breathable",
      "Cushioned"
    ],
    "specifications": {
      "Type": "Running",
      "Gender": "Men's",
      "Material": "Mesh"
    },
    "sku": "FOO-0001",
    "availability": "In Stock",
    "tags": [
      "Running Shoes",
      "Footwear",
      "Men"
    ]
  },
  {
    "name": "Running Shoes Women's",
    "description": "Lightweight women's running shoes with breathable mesh and cushioned sole.",
    "price": 79.99,
    "originalPrice": 119.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Running%20Shoes%20Women's",
    "thumbnail": "https://via.placeholder.com/200x200?text=Running%20Shoes%20Women's",
    "images": [
      "https://via.placeholder.com/400x300?text=Running%20Shoes%20Women's",
      "https://via.placeholder.com/400x300?text=Running%20Shoes%20Women's",
      "https://via.placeholder.com/400x300?text=Running%20Shoes%20Women's",
      "https://via.placeholder.com/400x300?text=Running%20Shoes%20Women's"
    ],
    "category": "Footwear",
    "brand": "RunPro",
    "rating": 4.7,
    "reviewCount": 890,
    "stock": 75,
    "features": [
      "Lightweight",
      "Breathable",
      "Cushioned"
    ],
    "specifications": {
      "Type": "Running",
      "Gender": "Women's",
      "Material": "Mesh"
    },
    "sku": "FOO-0002",
    "availability": "In Stock",
    "tags": [
      "Running Shoes",
      "Footwear",
      "Women"
    ]
  },
  {
    "name": "Casual Sneakers Unisex",
    "description": "Stylish casual sneakers, perfect for everyday wear, comfortable and durable.",
    "price": 59.99,
    "originalPrice": 89.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Casual%20Sneakers%20Unisex",
    "thumbnail": "https://via.placeholder.com/200x200?text=Casual%20Sneakers%20Unisex",
    "images": [
      "https://via.placeholder.com/400x300?text=Casual%20Sneakers%20Unisex",
      "https://via.placeholder.com/400x300?text=Casual%20Sneakers%20Unisex",
      "https://via.placeholder.com/400x300?text=Casual%20Sneakers%20Unisex",
      "https://via.placeholder.com/400x300?text=Casual%20Sneakers%20Unisex"
    ],
    "category": "Footwear",
    "brand": "SneakPro",
    "rating": 4.5,
    "reviewCount": 678,
    "stock": 100,
    "features": [
      "Casual",
      "Stylish",
      "Comfortable"
    ],
    "specifications": {
      "Type": "Sneakers",
      "Gender": "Unisex",
      "Material": "Canvas"
    },
    "sku": "FOO-0003",
    "availability": "In Stock",
    "tags": [
      "Sneakers",
      "Footwear",
      "Casual"
    ]
  },
  {
    "name": "Leather Shoes Men's",
    "description": "Formal leather shoes for men, perfect for office and special occasions.",
    "price": 99.99,
    "originalPrice": 149.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Leather%20Shoes%20Men's",
    "thumbnail": "https://via.placeholder.com/200x200?text=Leather%20Shoes%20Men's",
    "images": [
      "https://via.placeholder.com/400x300?text=Leather%20Shoes%20Men's",
      "https://via.placeholder.com/400x300?text=Leather%20Shoes%20Men's",
      "https://via.placeholder.com/400x300?text=Leather%20Shoes%20Men's",
      "https://via.placeholder.com/400x300?text=Leather%20Shoes%20Men's"
    ],
    "category": "Footwear",
    "brand": "ShoePro",
    "rating": 4.6,
    "reviewCount": 567,
    "stock": 60,
    "features": [
      "Formal",
      "Leather",
      "Office"
    ],
    "specifications": {
      "Type": "Formal",
      "Gender": "Men's",
      "Material": "Leather"
    },
    "sku": "FOO-0004",
    "availability": "In Stock",
    "tags": [
      "Leather Shoes",
      "Footwear",
      "Formal"
    ]
  },
  {
    "name": "Sandals Women's",
    "description": "Comfortable women's sandals with arch support, perfect for summer.",
    "price": 39.99,
    "originalPrice": 59.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Sandals%20Women's",
    "thumbnail": "https://via.placeholder.com/200x200?text=Sandals%20Women's",
    "images": [
      "https://via.placeholder.com/400x300?text=Sandals%20Women's",
      "https://via.placeholder.com/400x300?text=Sandals%20Women's",
      "https://via.placeholder.com/400x300?text=Sandals%20Women's",
      "https://via.placeholder.com/400x300?text=Sandals%20Women's"
    ],
    "category": "Footwear",
    "brand": "ShoePro",
    "rating": 4.4,
    "reviewCount": 456,
    "stock": 90,
    "features": [
      "Comfortable",
      "Arch Support",
      "Summer"
    ],
    "specifications": {
      "Type": "Sandals",
      "Gender": "Women's",
      "Material": "Synthetic"
    },
    "sku": "FOO-0005",
    "availability": "In Stock",
    "tags": [
      "Sandals",
      "Footwear",
      "Summer"
    ]
  },
  {
    "name": "Boots Men's Winter",
    "description": "Warm winter boots for men, waterproof and insulated for cold weather.",
    "price": 89.99,
    "originalPrice": 134.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Boots%20Men's%20Winter",
    "thumbnail": "https://via.placeholder.com/200x200?text=Boots%20Men's%20Winter",
    "images": [
      "https://via.placeholder.com/400x300?text=Boots%20Men's%20Winter",
      "https://via.placeholder.com/400x300?text=Boots%20Men's%20Winter",
      "https://via.placeholder.com/400x300?text=Boots%20Men's%20Winter",
      "https://via.placeholder.com/400x300?text=Boots%20Men's%20Winter"
    ],
    "category": "Footwear",
    "brand": "WinterPro",
    "rating": 4.7,
    "reviewCount": 789,
    "stock": 70,
    "features": [
      "Waterproof",
      "Insulated",
      "Warm"
    ],
    "specifications": {
      "Type": "Winter Boots",
      "Gender": "Men's",
      "Temperature": "-20°C"
    },
    "sku": "FOO-0006",
    "availability": "In Stock",
    "tags": [
      "Winter Boots",
      "Footwear",
      "Men"
    ]
  },
  {
    "name": "Flip Flops Unisex",
    "description": "Comfortable flip flops for beach and pool, lightweight and durable.",
    "price": 19.99,
    "originalPrice": 29.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Flip%20Flops%20Unisex",
    "thumbnail": "https://via.placeholder.com/200x200?text=Flip%20Flops%20Unisex",
    "images": [
      "https://via.placeholder.com/400x300?text=Flip%20Flops%20Unisex",
      "https://via.placeholder.com/400x300?text=Flip%20Flops%20Unisex",
      "https://via.placeholder.com/400x300?text=Flip%20Flops%20Unisex",
      "https://via.placeholder.com/400x300?text=Flip%20Flops%20Unisex"
    ],
    "category": "Footwear",
    "brand": "ShoePro",
    "rating": 4.3,
    "reviewCount": 567,
    "stock": 150,
    "features": [
      "Lightweight",
      "Beach",
      "Durable"
    ],
    "specifications": {
      "Type": "Flip Flops",
      "Gender": "Unisex",
      "Material": "Rubber"
    },
    "sku": "FOO-0007",
    "availability": "In Stock",
    "tags": [
      "Flip Flops",
      "Footwear",
      "Beach"
    ]
  },
  {
    "name": "Heels Women's",
    "description": "Elegant women's heels, perfect for parties and special occasions.",
    "price": 69.99,
    "originalPrice": 99.99,
    "discountPercentage": 30,
    "image": "https://via.placeholder.com/400x300?text=Heels%20Women's",
    "thumbnail": "https://via.placeholder.com/200x200?text=Heels%20Women's",
    "images": [
      "https://via.placeholder.com/400x300?text=Heels%20Women's",
      "https://via.placeholder.com/400x300?text=Heels%20Women's",
      "https://via.placeholder.com/400x300?text=Heels%20Women's",
      "https://via.placeholder.com/400x300?text=Heels%20Women's"
    ],
    "category": "Footwear",
    "brand": "ShoePro",
    "rating": 4.5,
    "reviewCount": 678,
    "stock": 80,
    "features": [
      "Elegant",
      "Party",
      "Comfortable"
    ],
    "specifications": {
      "Type": "Heels",
      "Gender": "Women's",
      "Heel Height": "8cm"
    },
    "sku": "FOO-0008",
    "availability": "In Stock",
    "tags": [
      "Heels",
      "Footwear",
      "Women"
    ]
  },
  {
    "name": "Sports Shoes Kids",
    "description": "Durable sports shoes for kids, perfect for running and playing.",
    "price": 44.99,
    "originalPrice": 64.99,
    "discountPercentage": 31,
    "image": "https://via.placeholder.com/400x300?text=Sports%20Shoes%20Kids",
    "thumbnail": "https://via.placeholder.com/200x200?text=Sports%20Shoes%20Kids",
    "images": [
      "https://via.placeholder.com/400x300?text=Sports%20Shoes%20Kids",
      "https://via.placeholder.com/400x300?text=Sports%20Shoes%20Kids",
      "https://via.placeholder.com/400x300?text=Sports%20Shoes%20Kids",
      "https://via.placeholder.com/400x300?text=Sports%20Shoes%20Kids"
    ],
    "category": "Footwear",
    "brand": "RunPro",
    "rating": 4.6,
    "reviewCount": 567,
    "stock": 95,
    "features": [
      "Durable",
      "Kids",
      "Sports"
    ],
    "specifications": {
      "Type": "Sports",
      "Age": "6-12",
      "Material": "Synthetic"
    },
    "sku": "FOO-0009",
    "availability": "In Stock",
    "tags": [
      "Kids Shoes",
      "Footwear",
      "Sports"
    ]
  },
  {
    "name": "Loafers Men's",
    "description": "Comfortable men's loafers, perfect for casual and semi-formal wear.",
    "price": 74.99,
    "originalPrice": 109.99,
    "discountPercentage": 32,
    "image": "https://via.placeholder.com/400x300?text=Loafers%20Men's",
    "thumbnail": "https://via.placeholder.com/200x200?text=Loafers%20Men's",
    "images": [
      "https://via.placeholder.com/400x300?text=Loafers%20Men's",
      "https://via.placeholder.com/400x300?text=Loafers%20Men's",
      "https://via.placeholder.com/400x300?text=Loafers%20Men's",
      "https://via.placeholder.com/400x300?text=Loafers%20Men's"
    ],
    "category": "Footwear",
    "brand": "ShoePro",
    "rating": 4.4,
    "reviewCount": 456,
    "stock": 85,
    "features": [
      "Comfortable",
      "Loafers",
      "Semi-Formal"
    ],
    "specifications": {
      "Type": "Loafers",
      "Gender": "Men's",
      "Material": "Suede"
    },
    "sku": "FOO-0010",
    "availability": "In Stock",
    "tags": [
      "Loafers",
      "Footwear",
      "Casual"
    ]
  },
  {
    "name": "Leather Wallet Men's",
    "description": "Genuine leather wallet for men with RFID protection, multiple card slots.",
    "price": 49.99,
    "originalPrice": 74.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Leather%20Wallet%20Men's",
    "thumbnail": "https://via.placeholder.com/200x200?text=Leather%20Wallet%20Men's",
    "images": [
      "https://via.placeholder.com/400x300?text=Leather%20Wallet%20Men's",
      "https://via.placeholder.com/400x300?text=Leather%20Wallet%20Men's",
      "https://via.placeholder.com/400x300?text=Leather%20Wallet%20Men's",
      "https://via.placeholder.com/400x300?text=Leather%20Wallet%20Men's"
    ],
    "category": "Accessories",
    "brand": "AccessPro",
    "rating": 4.7,
    "reviewCount": 890,
    "stock": 100,
    "features": [
      "Genuine Leather",
      "RFID Protection",
      "Multiple Slots"
    ],
    "specifications": {
      "Material": "Leather",
      "Gender": "Men's",
      "Card Slots": "8"
    },
    "sku": "ACC-0001",
    "availability": "In Stock",
    "tags": [
      "Wallet",
      "Leather",
      "Men"
    ]
  },
  {
    "name": "Sunglasses Unisex",
    "description": "UV400 protection sunglasses, stylish frame, perfect for summer.",
    "price": 34.99,
    "originalPrice": 54.99,
    "discountPercentage": 36,
    "image": "https://via.placeholder.com/400x300?text=Sunglasses%20Unisex",
    "thumbnail": "https://via.placeholder.com/200x200?text=Sunglasses%20Unisex",
    "images": [
      "https://via.placeholder.com/400x300?text=Sunglasses%20Unisex",
      "https://via.placeholder.com/400x300?text=Sunglasses%20Unisex",
      "https://via.placeholder.com/400x300?text=Sunglasses%20Unisex",
      "https://via.placeholder.com/400x300?text=Sunglasses%20Unisex"
    ],
    "category": "Accessories",
    "brand": "ShadePro",
    "rating": 4.5,
    "reviewCount": 678,
    "stock": 120,
    "features": [
      "UV400",
      "Stylish",
      "Unisex"
    ],
    "specifications": {
      "Protection": "UV400",
      "Gender": "Unisex",
      "Polarized": "Yes"
    },
    "sku": "ACC-0002",
    "availability": "In Stock",
    "tags": [
      "Sunglasses",
      "Accessories",
      "Summer"
    ]
  },
  {
    "name": "Watch Men's Analog",
    "description": "Classic analog watch for men with leather strap, water-resistant.",
    "price": 79.99,
    "originalPrice": 119.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Watch%20Men's%20Analog",
    "thumbnail": "https://via.placeholder.com/200x200?text=Watch%20Men's%20Analog",
    "images": [
      "https://via.placeholder.com/400x300?text=Watch%20Men's%20Analog",
      "https://via.placeholder.com/400x300?text=Watch%20Men's%20Analog",
      "https://via.placeholder.com/400x300?text=Watch%20Men's%20Analog",
      "https://via.placeholder.com/400x300?text=Watch%20Men's%20Analog"
    ],
    "category": "Accessories",
    "brand": "TimePro",
    "rating": 4.6,
    "reviewCount": 789,
    "stock": 80,
    "features": [
      "Classic",
      "Leather Strap",
      "Water-Resistant"
    ],
    "specifications": {
      "Type": "Analog",
      "Gender": "Men's",
      "Water Resistance": "50m"
    },
    "sku": "ACC-0003",
    "availability": "In Stock",
    "tags": [
      "Watch",
      "Analog",
      "Men"
    ]
  },
  {
    "name": "Backpack Laptop",
    "description": "Durable laptop backpack with padded compartment, multiple pockets.",
    "price": 54.99,
    "originalPrice": 79.99,
    "discountPercentage": 31,
    "image": "https://via.placeholder.com/400x300?text=Backpack%20Laptop",
    "thumbnail": "https://via.placeholder.com/200x200?text=Backpack%20Laptop",
    "images": [
      "https://via.placeholder.com/400x300?text=Backpack%20Laptop",
      "https://via.placeholder.com/400x300?text=Backpack%20Laptop",
      "https://via.placeholder.com/400x300?text=Backpack%20Laptop",
      "https://via.placeholder.com/400x300?text=Backpack%20Laptop"
    ],
    "category": "Accessories",
    "brand": "BagPro",
    "rating": 4.7,
    "reviewCount": 901,
    "stock": 95,
    "features": [
      "Laptop Compartment",
      "Durable",
      "Multiple Pockets"
    ],
    "specifications": {
      "Laptop Size": "15.6\"",
      "Material": "Polyester",
      "Capacity": "25L"
    },
    "sku": "ACC-0004",
    "availability": "In Stock",
    "tags": [
      "Backpack",
      "Laptop",
      "Accessories"
    ]
  },
  {
    "name": "Cap Unisex",
    "description": "Adjustable baseball cap, comfortable and stylish, perfect for outdoor activities.",
    "price": 19.99,
    "originalPrice": 29.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Cap%20Unisex",
    "thumbnail": "https://via.placeholder.com/200x200?text=Cap%20Unisex",
    "images": [
      "https://via.placeholder.com/400x300?text=Cap%20Unisex",
      "https://via.placeholder.com/400x300?text=Cap%20Unisex",
      "https://via.placeholder.com/400x300?text=Cap%20Unisex",
      "https://via.placeholder.com/400x300?text=Cap%20Unisex"
    ],
    "category": "Accessories",
    "brand": "CapPro",
    "rating": 4.4,
    "reviewCount": 567,
    "stock": 180,
    "features": [
      "Adjustable",
      "Stylish",
      "Outdoor"
    ],
    "specifications": {
      "Type": "Baseball Cap",
      "Gender": "Unisex",
      "Material": "Cotton"
    },
    "sku": "ACC-0005",
    "availability": "In Stock",
    "tags": [
      "Cap",
      "Baseball",
      "Accessories"
    ]
  },
  {
    "name": "Belt Leather Men's",
    "description": "Genuine leather belt for men, adjustable, perfect for formal and casual wear.",
    "price": 34.99,
    "originalPrice": 54.99,
    "discountPercentage": 36,
    "image": "https://via.placeholder.com/400x300?text=Belt%20Leather%20Men's",
    "thumbnail": "https://via.placeholder.com/200x200?text=Belt%20Leather%20Men's",
    "images": [
      "https://via.placeholder.com/400x300?text=Belt%20Leather%20Men's",
      "https://via.placeholder.com/400x300?text=Belt%20Leather%20Men's",
      "https://via.placeholder.com/400x300?text=Belt%20Leather%20Men's",
      "https://via.placeholder.com/400x300?text=Belt%20Leather%20Men's"
    ],
    "category": "Accessories",
    "brand": "AccessPro",
    "rating": 4.5,
    "reviewCount": 678,
    "stock": 110,
    "features": [
      "Genuine Leather",
      "Adjustable",
      "Versatile"
    ],
    "specifications": {
      "Material": "Leather",
      "Gender": "Men's",
      "Width": "3cm"
    },
    "sku": "ACC-0006",
    "availability": "In Stock",
    "tags": [
      "Belt",
      "Leather",
      "Men"
    ]
  },
  {
    "name": "Scarf Women's",
    "description": "Soft and stylish scarf for women, perfect for adding warmth and style.",
    "price": 24.99,
    "originalPrice": 39.99,
    "discountPercentage": 37,
    "image": "https://via.placeholder.com/400x300?text=Scarf%20Women's",
    "thumbnail": "https://via.placeholder.com/200x200?text=Scarf%20Women's",
    "images": [
      "https://via.placeholder.com/400x300?text=Scarf%20Women's",
      "https://via.placeholder.com/400x300?text=Scarf%20Women's",
      "https://via.placeholder.com/400x300?text=Scarf%20Women's",
      "https://via.placeholder.com/400x300?text=Scarf%20Women's"
    ],
    "category": "Accessories",
    "brand": "AccessPro",
    "rating": 4.6,
    "reviewCount": 789,
    "stock": 100,
    "features": [
      "Soft",
      "Stylish",
      "Warm"
    ],
    "specifications": {
      "Material": "Wool Blend",
      "Gender": "Women's",
      "Size": "180x70cm"
    },
    "sku": "ACC-0007",
    "availability": "In Stock",
    "tags": [
      "Scarf",
      "Accessories",
      "Women"
    ]
  },
  {
    "name": "Gloves Winter Unisex",
    "description": "Warm winter gloves with touchscreen capability, perfect for cold weather.",
    "price": 19.99,
    "originalPrice": 29.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Gloves%20Winter%20Unisex",
    "thumbnail": "https://via.placeholder.com/200x200?text=Gloves%20Winter%20Unisex",
    "images": [
      "https://via.placeholder.com/400x300?text=Gloves%20Winter%20Unisex",
      "https://via.placeholder.com/400x300?text=Gloves%20Winter%20Unisex",
      "https://via.placeholder.com/400x300?text=Gloves%20Winter%20Unisex",
      "https://via.placeholder.com/400x300?text=Gloves%20Winter%20Unisex"
    ],
    "category": "Accessories",
    "brand": "WinterPro",
    "rating": 4.4,
    "reviewCount": 567,
    "stock": 120,
    "features": [
      "Touchscreen",
      "Warm",
      "Unisex"
    ],
    "specifications": {
      "Gender": "Unisex",
      "Material": "Fleece",
      "Touchscreen": "Yes"
    },
    "sku": "ACC-0008",
    "availability": "In Stock",
    "tags": [
      "Gloves",
      "Winter",
      "Accessories"
    ]
  },
  {
    "name": "Tote Bag Canvas",
    "description": "Durable canvas tote bag, perfect for shopping and everyday use.",
    "price": 22.99,
    "originalPrice": 34.99,
    "discountPercentage": 34,
    "image": "https://via.placeholder.com/400x300?text=Tote%20Bag%20Canvas",
    "thumbnail": "https://via.placeholder.com/200x200?text=Tote%20Bag%20Canvas",
    "images": [
      "https://via.placeholder.com/400x300?text=Tote%20Bag%20Canvas",
      "https://via.placeholder.com/400x300?text=Tote%20Bag%20Canvas",
      "https://via.placeholder.com/400x300?text=Tote%20Bag%20Canvas",
      "https://via.placeholder.com/400x300?text=Tote%20Bag%20Canvas"
    ],
    "category": "Accessories",
    "brand": "BagPro",
    "rating": 4.5,
    "reviewCount": 678,
    "stock": 140,
    "features": [
      "Durable",
      "Canvas",
      "Spacious"
    ],
    "specifications": {
      "Material": "Canvas",
      "Size": "40x35cm",
      "Pockets": "2"
    },
    "sku": "ACC-0009",
    "availability": "In Stock",
    "tags": [
      "Tote Bag",
      "Canvas",
      "Accessories"
    ]
  },
  {
    "name": "Jewelry Set Women's",
    "description": "Elegant jewelry set: necklace, earrings, bracelet, perfect for special occasions.",
    "price": 59.99,
    "originalPrice": 89.99,
    "discountPercentage": 33,
    "image": "https://via.placeholder.com/400x300?text=Jewelry%20Set%20Women's",
    "thumbnail": "https://via.placeholder.com/200x200?text=Jewelry%20Set%20Women's",
    "images": [
      "https://via.placeholder.com/400x300?text=Jewelry%20Set%20Women's",
      "https://via.placeholder.com/400x300?text=Jewelry%20Set%20Women's",
      "https://via.placeholder.com/400x300?text=Jewelry%20Set%20Women's",
      "https://via.placeholder.com/400x300?text=Jewelry%20Set%20Women's"
    ],
    "category": "Accessories",
    "brand": "JewelryPro",
    "rating": 4.7,
    "reviewCount": 890,
    "stock": 70,
    "features": [
      "Elegant",
      "Set",
      "Special Occasion"
    ],
    "specifications": {
      "Material": "Alloy",
      "Gender": "Women's",
      "Set Includes": "Necklace, Earrings, Bracelet"
    },
    "sku": "ACC-0010",
    "availability": "In Stock",
    "tags": [
      "Jewelry",
      "Accessories",
      "Women"
    ]
  }
];

const permanentImageMap = [
  {
    "skuSearch": "Wireless Bluetooth Headphones",
    "image": "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Smart Watch Pro",
    "image": "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Wireless Earbuds",
    "image": "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpower-wireless-charger/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpower-wireless-charger/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpower-wireless-charger/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpower-wireless-charger/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpower-wireless-charger/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Gaming Keyboard",
    "image": "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_t.png",
    "images": [
      "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_t.png",
      "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_t.png",
      "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_t.png",
      "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_t.png"
    ]
  },
  {
    "skuSearch": "Gaming Mouse",
    "image": "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png",
    "images": [
      "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png",
      "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png",
      "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png",
      "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png"
    ]
  },
  {
    "skuSearch": "Bluetooth Speaker",
    "image": "https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Laptop Backpack",
    "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
    "images": [
      "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
      "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
      "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
      "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png"
    ]
  },
  {
    "skuSearch": "Power Bank",
    "image": "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-battery-pack/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-battery-pack/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-battery-pack/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-battery-pack/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-battery-pack/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "AeroSound Pro Wireless Earbuds",
    "image": "https://cdn.dummyjson.com/product-images/mobile-accessories/beats-flex-wireless-earphones/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/mobile-accessories/beats-flex-wireless-earphones/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/beats-flex-wireless-earphones/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/beats-flex-wireless-earphones/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/beats-flex-wireless-earphones/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "ChronoFit Smart Watch Platinum",
    "image": "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-homepod-mini-cosmic-grey/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-homepod-mini-cosmic-grey/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-homepod-mini-cosmic-grey/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-homepod-mini-cosmic-grey/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-homepod-mini-cosmic-grey/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Cotton T-Shirt",
    "image": "https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/1.webp",
      "https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/2.webp",
      "https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/3.webp",
      "https://cdn.dummyjson.com/product-images/mens-shirts/gigabyte-aorus-men-tshirt/4.webp"
    ]
  },
  {
    "skuSearch": "Polo Shirt",
    "image": "https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/1.webp",
      "https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/2.webp",
      "https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/3.webp",
      "https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/4.webp"
    ]
  },
  {
    "skuSearch": "Denim Jacket",
    "image": "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
    "images": [
      "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
      "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
      "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
      "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png"
    ]
  },
  {
    "skuSearch": "Hoodie",
    "image": "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Jeans",
    "image": "https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Chinos",
    "image": "https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Formal Shirt",
    "image": "https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/1.webp",
      "https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/2.webp",
      "https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/3.webp",
      "https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/4.webp"
    ]
  },
  {
    "skuSearch": "Sweatshirt",
    "image": "https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Cargo Pants",
    "image": "https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/beauty/red-nail-polish/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Running Shorts",
    "image": "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "LED Table Lamp",
    "image": "https://cdn.dummyjson.com/product-images/home-decoration/table-lamp/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/home-decoration/table-lamp/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/home-decoration/table-lamp/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/home-decoration/table-lamp/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/home-decoration/table-lamp/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Coffee Maker",
    "image": "https://cdn.dummyjson.com/product-images/groceries/nescafe-coffee/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/nescafe-coffee/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/nescafe-coffee/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/nescafe-coffee/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/nescafe-coffee/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Vacuum Cleaner",
    "image": "https://cdn.dummyjson.com/product-images/home-decoration/decoration-swing/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/home-decoration/decoration-swing/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/home-decoration/decoration-swing/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/home-decoration/decoration-swing/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/home-decoration/decoration-swing/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Air Fryer",
    "image": "https://cdn.dummyjson.com/product-images/home-decoration/family-tree-photo-frame/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/home-decoration/family-tree-photo-frame/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/home-decoration/family-tree-photo-frame/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/home-decoration/family-tree-photo-frame/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/home-decoration/family-tree-photo-frame/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Blender",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/boxed-blender/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/boxed-blender/1.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/boxed-blender/2.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/boxed-blender/3.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/boxed-blender/4.webp"
    ]
  },
  {
    "skuSearch": "Wall Clock",
    "image": "https://cdn.dummyjson.com/product-images/home-decoration/house-showpiece-plant/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/home-decoration/house-showpiece-plant/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/home-decoration/house-showpiece-plant/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/home-decoration/house-showpiece-plant/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/home-decoration/house-showpiece-plant/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Storage Basket",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/lunch-box/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/lunch-box/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/lunch-box/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/lunch-box/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/lunch-box/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Bed Sheet Set",
    "image": "https://cdn.dummyjson.com/product-images/home-decoration/plant-pot/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/home-decoration/plant-pot/1.webp",
      "https://cdn.dummyjson.com/product-images/home-decoration/plant-pot/2.webp",
      "https://cdn.dummyjson.com/product-images/home-decoration/plant-pot/3.webp",
      "https://cdn.dummyjson.com/product-images/home-decoration/plant-pot/4.webp"
    ]
  },
  {
    "skuSearch": "Dining Chair",
    "image": "https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Kitchen Organizer",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/bamboo-spatula/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/bamboo-spatula/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/bamboo-spatula/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/bamboo-spatula/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/bamboo-spatula/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Atomic Habits",
    "image": "https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "The Psychology of Money",
    "image": "https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Deep Work",
    "image": "https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/fragrances/dolce-shine-eau-de/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Rich Dad Poor Dad",
    "image": "https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "The Alchemist",
    "image": "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-bed/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Ikigai",
    "image": "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/furniture/annibale-colombo-sofa/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Clean Code",
    "image": "https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Think and Grow Rich",
    "image": "https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/furniture/wooden-bathroom-sink-with-mirror/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "The Lean Startup",
    "image": "https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/apple/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Harry Potter Collection",
    "image": "https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mens-watches/longines-master-collection/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Yoga Mat Premium",
    "image": "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Football",
    "image": "https://cdn.dummyjson.com/product-images/sports-accessories/american-football/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/sports-accessories/american-football/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/sports-accessories/american-football/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/sports-accessories/american-football/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/sports-accessories/american-football/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Basketball",
    "image": "https://cdn.dummyjson.com/product-images/sports-accessories/basketball/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/sports-accessories/basketball/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/sports-accessories/basketball/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/sports-accessories/basketball/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/sports-accessories/basketball/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Cricket Bat",
    "image": "https://cdn.dummyjson.com/product-images/sports-accessories/cricket-ball/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/sports-accessories/cricket-ball/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/sports-accessories/cricket-ball/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/sports-accessories/cricket-ball/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/sports-accessories/cricket-ball/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Dumbbells",
    "image": "https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/1.webp",
      "https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/2.webp",
      "https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/3.webp",
      "https://cdn.dummyjson.com/product-images/mens-shoes/nike-baseball-cleats/4.webp"
    ]
  },
  {
    "skuSearch": "Resistance Bands",
    "image": "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/1.webp",
      "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/2.webp",
      "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/3.webp",
      "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-&-red/4.webp"
    ]
  },
  {
    "skuSearch": "Skipping Rope",
    "image": "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-red/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-red/1.webp",
      "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-red/2.webp",
      "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-red/3.webp",
      "https://cdn.dummyjson.com/product-images/mens-shoes/sports-sneakers-off-white-red/4.webp"
    ]
  },
  {
    "skuSearch": "Tennis Racket",
    "image": "https://cdn.dummyjson.com/product-images/sports-accessories/baseball-ball/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/sports-accessories/baseball-ball/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/sports-accessories/baseball-ball/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/sports-accessories/baseball-ball/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/sports-accessories/baseball-ball/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Gym Gloves",
    "image": "https://cdn.dummyjson.com/product-images/sports-accessories/baseball-glove/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/sports-accessories/baseball-glove/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/sports-accessories/baseball-glove/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/sports-accessories/baseball-glove/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/sports-accessories/baseball-glove/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Water Bottle",
    "image": "https://cdn.dummyjson.com/product-images/groceries/water/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/water/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/water/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/water/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/water/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Vitamin C Serum",
    "image": "https://cdn.dummyjson.com/product-images/skin-care/attitude-super-leaves-hand-soap/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/skin-care/attitude-super-leaves-hand-soap/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/skin-care/attitude-super-leaves-hand-soap/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/skin-care/attitude-super-leaves-hand-soap/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/skin-care/attitude-super-leaves-hand-soap/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Moisturizing Face Cream",
    "image": "https://cdn.dummyjson.com/product-images/skin-care/vaseline-men-body-and-face-lotion/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/skin-care/vaseline-men-body-and-face-lotion/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/skin-care/vaseline-men-body-and-face-lotion/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/skin-care/vaseline-men-body-and-face-lotion/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/skin-care/vaseline-men-body-and-face-lotion/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Lipstick Set (12 Colors)",
    "image": "https://cdn.dummyjson.com/product-images/skin-care/olay-ultra-moisture-shea-butter-body-wash/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/skin-care/olay-ultra-moisture-shea-butter-body-wash/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/skin-care/olay-ultra-moisture-shea-butter-body-wash/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/skin-care/olay-ultra-moisture-shea-butter-body-wash/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/skin-care/olay-ultra-moisture-shea-butter-body-wash/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Mascara Volume & Length",
    "image": "https://cdn.dummyjson.com/product-images/groceries/beef-steak/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/beef-steak/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/beef-steak/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/beef-steak/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/beef-steak/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Shampoo & Conditioner Set",
    "image": "https://cdn.dummyjson.com/product-images/groceries/cat-food/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/cat-food/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/cat-food/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/cat-food/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/cat-food/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Facial Cleanser",
    "image": "https://cdn.dummyjson.com/product-images/groceries/chicken-meat/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/chicken-meat/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/chicken-meat/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/chicken-meat/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/chicken-meat/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Nail Polish Set (18 Colors)",
    "image": "https://cdn.dummyjson.com/product-images/groceries/cooking-oil/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/cooking-oil/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/cooking-oil/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/cooking-oil/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/cooking-oil/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Perfume (100ml)",
    "image": "https://cdn.dummyjson.com/product-images/groceries/cucumber/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/cucumber/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/cucumber/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/cucumber/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/cucumber/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Face Mask Set (5 Pack)",
    "image": "https://cdn.dummyjson.com/product-images/groceries/dog-food/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/dog-food/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/dog-food/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/dog-food/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/dog-food/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Deodorant (Pack of 3)",
    "image": "https://cdn.dummyjson.com/product-images/groceries/eggs/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/eggs/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/eggs/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/eggs/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/eggs/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Organic Almonds (1kg)",
    "image": "https://cdn.dummyjson.com/product-images/groceries/fish-steak/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/fish-steak/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/fish-steak/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/fish-steak/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/fish-steak/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Greek Yogurt (Pack of 6)",
    "image": "https://cdn.dummyjson.com/product-images/groceries/green-bell-pepper/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/green-bell-pepper/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/green-bell-pepper/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/green-bell-pepper/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/green-bell-pepper/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Olive Oil (1L)",
    "image": "https://cdn.dummyjson.com/product-images/groceries/green-chili-pepper/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/green-chili-pepper/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/green-chili-pepper/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/green-chili-pepper/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/green-chili-pepper/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Coffee Beans (500g)",
    "image": "https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Organic Quinoa (500g)",
    "image": "https://cdn.dummyjson.com/product-images/groceries/ice-cream/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/ice-cream/1.webp",
      "https://cdn.dummyjson.com/product-images/groceries/ice-cream/2.webp",
      "https://cdn.dummyjson.com/product-images/groceries/ice-cream/3.webp",
      "https://cdn.dummyjson.com/product-images/groceries/ice-cream/4.webp"
    ]
  },
  {
    "skuSearch": "Green Tea (Pack of 100)",
    "image": "https://cdn.dummyjson.com/product-images/groceries/juice/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/juice/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/juice/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/juice/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/juice/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Dark Chocolate (70%)",
    "image": "https://cdn.dummyjson.com/product-images/groceries/kiwi/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/kiwi/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/kiwi/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/kiwi/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/kiwi/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Honey (500g)",
    "image": "https://cdn.dummyjson.com/product-images/groceries/lemon/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/lemon/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/lemon/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/lemon/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/lemon/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Oats (1kg)",
    "image": "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png",
    "images": [
      "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png",
      "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png",
      "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png",
      "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png"
    ]
  },
  {
    "skuSearch": "Almond Milk (1L)",
    "image": "https://cdn.dummyjson.com/product-images/groceries/milk/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/milk/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/milk/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/milk/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/milk/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Building Blocks Set (1000 Pieces)",
    "image": "https://cdn.dummyjson.com/product-images/groceries/mulberry/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/mulberry/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/mulberry/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/mulberry/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/mulberry/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Board Game - Strategy",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/chopping-board/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/chopping-board/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/chopping-board/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/chopping-board/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/chopping-board/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Remote Control Car",
    "image": "https://cdn.dummyjson.com/product-images/groceries/potatoes/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/potatoes/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/potatoes/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/potatoes/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/potatoes/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Teddy Bear (30cm)",
    "image": "https://cdn.dummyjson.com/product-images/groceries/protein-powder/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/protein-powder/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/protein-powder/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/protein-powder/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/protein-powder/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Puzzle (1000 Pieces)",
    "image": "https://cdn.dummyjson.com/product-images/groceries/red-onions/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/red-onions/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/red-onions/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/red-onions/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/red-onions/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Action Figure Set (5 Pack)",
    "image": "https://cdn.dummyjson.com/product-images/groceries/rice/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/rice/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/rice/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/rice/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/rice/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Wooden Train Set",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/fine-mesh-strainer/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/fine-mesh-strainer/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/fine-mesh-strainer/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/fine-mesh-strainer/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/fine-mesh-strainer/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Doll Set with Accessories",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/silver-pot-with-glass-cap/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/silver-pot-with-glass-cap/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/silver-pot-with-glass-cap/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/silver-pot-with-glass-cap/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/silver-pot-with-glass-cap/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Science Kit for Kids",
    "image": "https://cdn.dummyjson.com/product-images/groceries/soft-drinks/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/soft-drinks/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/soft-drinks/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/soft-drinks/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/soft-drinks/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Card Game Pack (3 Games)",
    "image": "https://cdn.dummyjson.com/product-images/groceries/strawberry/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/strawberry/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/strawberry/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/strawberry/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/strawberry/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Running Shoes Men's",
    "image": "https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/1.webp",
      "https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/2.webp",
      "https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/3.webp",
      "https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/4.webp"
    ]
  },
  {
    "skuSearch": "Running Shoes Women's",
    "image": "https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/1.webp",
      "https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/2.webp",
      "https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/3.webp",
      "https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/4.webp"
    ]
  },
  {
    "skuSearch": "Casual Sneakers Unisex",
    "image": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png",
    "images": [
      "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png",
      "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png",
      "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png",
      "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png"
    ]
  },
  {
    "skuSearch": "Leather Shoes Men's",
    "image": "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png",
    "images": [
      "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png",
      "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png",
      "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png",
      "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png"
    ]
  },
  {
    "skuSearch": "Sandals Women's",
    "image": "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png",
    "images": [
      "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png",
      "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png",
      "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png",
      "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png"
    ]
  },
  {
    "skuSearch": "Boots Men's Winter",
    "image": "https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/1.webp",
      "https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/2.webp",
      "https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/3.webp",
      "https://cdn.dummyjson.com/product-images/mens-shirts/man-short-sleeve-shirt/4.webp"
    ]
  },
  {
    "skuSearch": "Flip Flops Unisex",
    "image": "https://cdn.dummyjson.com/product-images/groceries/tissue-paper-box/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/groceries/tissue-paper-box/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/tissue-paper-box/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/tissue-paper-box/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/groceries/tissue-paper-box/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Heels Women's",
    "image": "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2t.png",
    "images": [
      "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2t.png",
      "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2t.png",
      "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2t.png",
      "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2t.png"
    ]
  },
  {
    "skuSearch": "Sports Shoes Kids",
    "image": "https://cdn.dummyjson.com/product-images/sports-accessories/basketball-rim/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/sports-accessories/basketball-rim/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/sports-accessories/basketball-rim/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/sports-accessories/basketball-rim/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/sports-accessories/basketball-rim/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Loafers Men's",
    "image": "https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/1.webp",
      "https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/2.webp",
      "https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/3.webp",
      "https://cdn.dummyjson.com/product-images/mens-shirts/men-check-shirt/4.webp"
    ]
  },
  {
    "skuSearch": "Leather Wallet Men's",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-aluminium-cup/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-aluminium-cup/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-aluminium-cup/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-aluminium-cup/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-aluminium-cup/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Sunglasses Unisex",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-whisk/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-whisk/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-whisk/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-whisk/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-whisk/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Watch Men's Analog",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/carbon-steel-wok/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/carbon-steel-wok/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/carbon-steel-wok/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/carbon-steel-wok/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/carbon-steel-wok/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Backpack Laptop",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/citrus-squeezer-yellow/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/citrus-squeezer-yellow/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/citrus-squeezer-yellow/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/citrus-squeezer-yellow/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/citrus-squeezer-yellow/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Cap Unisex",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/egg-slicer/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/egg-slicer/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/egg-slicer/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/egg-slicer/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/egg-slicer/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Belt Leather Men's",
    "image": "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Scarf Women's",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/electric-stove/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/electric-stove/1.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/electric-stove/2.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/electric-stove/3.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/electric-stove/4.webp"
    ]
  },
  {
    "skuSearch": "Gloves Winter Unisex",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/fork/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/fork/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/fork/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/fork/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/fork/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Tote Bag Canvas",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/glass/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/glass/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/glass/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/glass/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/glass/thumbnail.webp"
    ]
  },
  {
    "skuSearch": "Jewelry Set Women's",
    "image": "https://cdn.dummyjson.com/product-images/kitchen-accessories/grater-black/thumbnail.webp",
    "images": [
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/grater-black/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/grater-black/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/grater-black/thumbnail.webp",
      "https://cdn.dummyjson.com/product-images/kitchen-accessories/grater-black/thumbnail.webp"
    ]
  }
];

const normalizedProducts = products.map((product) => {
  const mapEntry = permanentImageMap.find(m => m.skuSearch === product.name);
  if (!mapEntry) {
    throw new Error("Missing image mapping for " + product.name);
  }
  
  return {
    ...product,
    price: toINR(product.price),
    originalPrice: toINR(product.originalPrice),
    image: mapEntry.image,
    thumbnail: mapEntry.image,
    images: mapEntry.images,
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
