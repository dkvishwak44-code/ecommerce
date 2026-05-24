<div align="center">

# 🛒 E-Commerce Platform

### A Full-Stack MERN + Next.js E-Commerce Solution

![Admin](https://img.shields.io/badge/Admin-Completed-brightgreen?style=for-the-badge)
![Client](https://img.shields.io/badge/Client-In%20Progress-yellow?style=for-the-badge)
![Server](https://img.shields.io/badge/Server-In%20Progress-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

[Report Bug](https://github.com/dkvishwak44-code/ecommerce/issues) · [Request Feature](https://github.com/dkvishwak44-code/ecommerce/issues)

</div>

---

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Project Status](#project-status)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Contact](#contact)

---

## 📖 About The Project

A modern, full-stack e-commerce platform built with the MERN stack and Next.js. The project has three parts — a customer-facing client app, an admin dashboard for store management, and a REST API backend powered by Express.js and MongoDB.

---

## 🚦 Project Status

| Folder | Description | Status |
|---|---|---|
| 📂 `admin` | Admin dashboard — manage products, orders, users | ✅ **Completed** |
| 📂 `e-commerce-client` | Customer facing shopping app | 🚧 **In Progress** |
| 📂 `server` | REST API — Express.js + MongoDB | 🚧 **In Progress** |

---

## ✨ Features

### 🧑‍💼 Admin Panel — ✅ Completed
- ✅ Secure Admin Login with JWT
- ✅ Dashboard with Stats & Charts
- ✅ Product Management (Add, Edit, Delete)
- ✅ Order Management & Status Updates
- ✅ Customer Management
- ✅ Role & Permission Management (RBAC)
- ✅ Store Settings
- ✅ Responsive Design

### 🛍️ Client App — 🚧 In Progress
- ✅ User Registration & Login
- ✅ Browse & Search Products
- 🚧 Product Detail Page
- 🚧 Add to Cart / Remove from Cart
- 🚧 Place Orders
- 🚧 Order History
- ⏳ Wishlist
- ⏳ Payment Integration

### 🖥️ Server — 🚧 In Progress
- ✅ Auth Routes (Register, Login, JWT)
- ✅ Product Routes
- 🚧 Cart Routes
- 🚧 Order Routes
- 🚧 Payment Integration
- ⏳ Email Notifications

> ✅ Done &nbsp;&nbsp; 🚧 In Progress &nbsp;&nbsp; ⏳ Planned

---

## 🛠️ Tech Stack

### Admin & Client (Next.js)
| Technology | Purpose |
|---|---|
| **Next.js 14** | React Framework (App Router) |
| **React.js** | UI Library |
| **Redux Toolkit** | State Management |
| **Tailwind CSS** | Styling |
| **Shadcn/ui** | UI Components |
| **Axios** | HTTP Requests |

### Server (Express.js)
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime |
| **Express.js** | Web Framework |
| **MongoDB** | Database |
| **Mongoose** | ODM |
| **JWT** | Authentication |
| **Bcrypt** | Password Hashing |

---

## 📁 Project Structure

```
ecommerce/
│
├── 📂 admin/                        ✅ COMPLETED
│   ├── src/
│   │   ├── app/
│   │   │   ├── (protected)/         # Auth-guarded pages
│   │   │   │   ├── dashboard/
│   │   │   │   ├── products/
│   │   │   │   ├── orders/
│   │   │   │   ├── customers/
│   │   │   │   ├── analytics/
│   │   │   │   └── settings/
│   │   │   └── (public)/
│   │   │       ├── login/
│   │   │       └── register/
│   │   ├── components/              # UI components
│   │   ├── store/                   # Redux store
│   │   ├── hooks/                   # Custom hooks
│   │   ├── lib/                     # JWT, auth, utils
│   │   └── middleware/              # Route protection
│   └── package.json
│
├── 📂 e-commerce-client/            🚧 IN PROGRESS
│   ├── src/
│   │   ├── app/                     # Next.js pages
│   │   ├── components/              # UI components
│   │   └── lib/                     # Utilities
│   └── package.json
│
└── 📂 server/                       🚧 IN PROGRESS
    ├── models/                      # Mongoose models
    ├── routes/                      # API routes
    ├── controllers/                 # Business logic
    ├── middleware/                  # Auth & error handling
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Git](https://git-scm.com/)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/dkvishwak44-code/ecommerce.git
cd ecommerce
```

**2. Setup Server**
```bash
cd server
npm install
npm run dev
# Runs on http://localhost:5000
```

**3. Setup Admin Panel**
```bash
cd admin
npm install
npm run dev
# Runs on http://localhost:3001
```

**4. Setup Client App**
```bash
cd e-commerce-client
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## 🔐 Environment Variables

### `server/.env`
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### `admin/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### `e-commerce-client/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Status |
|---|---|---|---|
| POST | `/api/auth/register` | Register user | ✅ |
| POST | `/api/auth/login` | Login user | ✅ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Products
| Method | Endpoint | Description | Status |
|---|---|---|---|
| GET | `/api/products` | Get all products | ✅ |
| GET | `/api/products/:id` | Get single product | ✅ |
| POST | `/api/products` | Create product (Admin) | ✅ |
| PUT | `/api/products/:id` | Update product (Admin) | ✅ |
| DELETE | `/api/products/:id` | Delete product (Admin) | ✅ |

### Cart
| Method | Endpoint | Description | Status |
|---|---|---|---|
| GET | `/api/cart/:userId` | Get user cart | 🚧 |
| POST | `/api/cart` | Add to cart | 🚧 |
| DELETE | `/api/cart/:id` | Remove from cart | 🚧 |

### Orders
| Method | Endpoint | Description | Status |
|---|---|---|---|
| POST | `/api/orders` | Place order | 🚧 |
| GET | `/api/orders` | Get all orders (Admin) | 🚧 |
| GET | `/api/orders/:userId` | Get user orders | 🚧 |
| PUT | `/api/orders/:id` | Update order status | 🚧 |

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Admin Panel UI
- [x] Admin Authentication & RBAC
- [x] Product Management (Admin)
- [x] Order Management (Admin)
- [x] Customer Management (Admin)
- [x] Dashboard & Analytics (Admin)

### 🚧 In Progress
- [ ] Client App — Product Listing & Detail
- [ ] Client App — Cart & Checkout
- [ ] Server — Cart & Order APIs
- [ ] JWT Auth on Server

### ⏳ Planned
- [ ] Payment Integration (Razorpay)
- [ ] Product Reviews & Ratings
- [ ] Wishlist Feature
- [ ] Email Notifications
- [ ] Deploy to Production

---

## 🤝 Contributing

1. Fork the project
2. Create your branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Dinesh Vishwakarma**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/dkvishwak44-code)
[![Email](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:dkvishwak44@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/YOUR_LINKEDIN)

---

## 📄 License

Distributed under the MIT License.

---

<div align="center">

⭐ **If you like this project, give it a star!** ⭐

</div>
