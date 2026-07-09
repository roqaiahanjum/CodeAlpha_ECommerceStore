# ShopEase — E-commerce Store

A modern full-stack e-commerce application built with React, Node.js, Express, and MongoDB.

---

## Live Features

- **User Authentication**: Secure registration and login with JWT token-based authentication
- **Product Discovery**: Browse 100 unique products with search functionality and 10 category filters (Electronics, Fashion, Home & Kitchen, Books, Sports & Fitness, Beauty & Personal Care, Grocery, Toys & Games, Footwear, Accessories)
- **Product Details**: Detailed product pages with images, specifications, and pricing
- **Shopping Cart**: Add items to cart, adjust quantities, and view real-time totals
- **Checkout & Orders**: Complete checkout process with order processing and order history
- **Pricing**: All prices displayed in Indian Rupees (₹)
- **Image Validation**: Script to verify all product images are working correctly

---

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose ODM)

### Authentication
- JSON Web Tokens (JWT)
- bcrypt for password hashing

---

## Project Structure

```
CodeAlpha_ECommerceStore/
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT authentication middleware
│   ├── models/
│   │   ├── Order.js               # Order schema
│   │   ├── Product.js             # Product schema
│   │   └── User.js                # User schema
│   ├── routes/
│   │   ├── authRoutes.js          # Authentication endpoints
│   │   ├── cartRoutes.js          # Cart management endpoints
│   │   ├── orderRoutes.js         # Order processing endpoints
│   │   └── productRoutes.js       # Product endpoints
│   ├── seed/
│   │   └── seedProducts.js        # Database seeding script (100 products)

│   ├── server.js                  # Express server entry point
│   ├── .env                       # Environment variables
│   ├── .env.example               # Environment variables template
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx         # Navigation component
    │   │   └── ProtectedRoute.jsx  # Route protection wrapper
    │   ├── contexts/
    │   │   ├── AuthContext.jsx    # Authentication state management
    │   │   └── CartContext.jsx     # Cart state management
    │   ├── pages/
    │   │   ├── Cart.jsx           # Shopping cart page
    │   │   ├── Checkout.jsx       # Checkout form page
    │   │   ├── Home.jsx           # Home page with product listings
    │   │   ├── Login.jsx          # User login page
    │   │   ├── Orders.jsx         # Order history page
    │   │   ├── ProductDetail.jsx  # Individual product details page
    │   │   └── Register.jsx       # User registration page
    │   ├── utils/
    │   │   ├── api.js             # API utility functions
    │   │   └── formatters.js      # Data formatting utilities
    │   ├── App.jsx                # Main app component
    │   ├── main.jsx               # React entry point
    │   └── index.css              # Global styles
    ├── index.html                 # HTML template
    ├── vite.config.js            # Vite configuration (port: 3000)
    ├── tailwind.config.js         # Tailwind CSS configuration
    ├── postcss.config.js          # PostCSS configuration
    └── package.json
```

---

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local instance or MongoDB Atlas connection string)

### Clone the Repository
```bash
git clone <your-repo-url>
cd CodeAlpha_ECommerceStore
```

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Configure your `.env` file with:
```env
PORT=5006
MONGO_URI=mongodb://127.0.0.1:27017/shopease
JWT_SECRET=your_jwt_secret_here
```

Seed the database with sample products:
```bash
npm run seed
```

Check if all product images are working:
```bash

```

Start the backend server:
```bash
npm start
```
The backend will run on `http://localhost:5006`

### Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:3000`

---

## API Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/auth/register` | POST | Register a new user | No |
| `/api/auth/login` | POST | Login user and get token | No |
| `/api/auth/me` | GET | Get current user profile | Yes |
| `/api/products` | GET | Get all products (supports category & search filters) | No |
| `/api/products/:id` | GET | Get single product by ID | No |
| `/api/products` | POST | Create a product (for seeding) | No |
| `/api/cart` | GET | Get user's cart | Yes |
| `/api/cart` | POST | Add/update item in cart | Yes |
| `/api/cart/:productId` | DELETE | Remove item from cart | Yes |
| `/api/orders` | POST | Create new order | Yes |
| `/api/orders` | GET | Get user's order history | Yes |
| `/api/orders/:id` | GET | Get single order by ID | Yes |

---

## Screenshots

(Screenshot: Home page)

(Screenshot: Product details)

(Screenshot: Cart)

(Screenshot: Checkout)

---

## Acknowledgements

This project was developed as part of the CodeAlpha internship program. I would like to thank CodeAlpha for providing this opportunity to build a full-stack e-commerce application and enhance my skills in MERN stack development.

---

## License

This project is licensed under the MIT License.
