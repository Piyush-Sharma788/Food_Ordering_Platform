# Cd: Zaika — Modernized Food Ordering & Campus Kitchen Management Platform

> *"Flavours that fuel your study delivered with care"*

![Cd: Zaika](https://upload.wikimedia.org/wikipedia/commons/f/f2/Infosys.Electronic.City.Cafeteria.JPG)

## 1. Project Overview

**Cd: Zaika** (also known as **Campus da: Zaika**) is a modern, full-stack, AI-powered food ordering and kitchen management platform designed specifically for campus students, faculty, and canteen operators.

This repository modernizes an initial static prototype (`Final_home.html`, `final_menu.html`, `FINAL_LOGIN.html`, `canteen.html`, `final about us.html`) into an enterprise-ready modular application built with **Next.js 14 (App Router), React, TypeScript, Tailwind CSS, MongoDB, OpenAI & Google Gemini AI, AWS S3, and Puppeteer**.

---

## 2. Preserved Business Logic & Heritage

All original core features and business logic from the static prototype have been faithfully preserved and upgraded:

1. **Complete 20+ Campus Menu Catalog**:
   - Preserves all items across Shakes, Coffees, Burgers, Sandwiches, Maggie Masaledar, Indo-Chinese, Steam & Fried Momos, Pizzas (including Kulhad Pizza), and South Indian Idli.
2. **Dynamic Preparation Time Algorithm**:
   - Accurately scales kitchen waiting time based on item quantity using the legacy formula:
     $$\text{PrepTime} = \begin{cases} \text{baseTime}, & \text{if } \text{qty} = 1 \\ \text{baseTime} + \text{baseTime} \times 0.35 \times (\text{qty} - 1), & \text{if } \text{qty} > 1 \end{cases}$$
3. **Monochrome High-Contrast Visual Aesthetic**:
   - Deep Black (`#000000`), Crisp White (`#ffffff`), and Accent Teal (`#0d9488` echoing `#17a`) with smooth transitions and grayscale hover effects.
4. **Leadership Team & Mission**:
   - Honors founders Tanishq Soni (Co-founder & CEO), Akash Singh (CTO & Head of Operations), and Daksh Sharma.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS | Responsive, accessible UI with server components and client interactions |
| **Backend & REST API** | Node.js 20+, TypeScript, Next.js Route Handlers | Centralized business logic, strict Zod validation, and error handling |
| **Database** | MongoDB & Mongoose | Schemas, indexes, and atomic updates for users, orders, eateries, and menu items |
| **Artificial Intelligence** | OpenAI API (`gpt-4o-mini`) & Google Generative AI (`gemini-1.5-flash`) | Dual AI adapters with automatic fallback for conversational food discovery and recommendations |
| **File Storage** | AWS S3 & Presigned Upload URLs | Secure menu item and restaurant photo storage with local buffer fallback |
| **Document Generation** | Puppeteer | Server-side digital receipt and PDF invoice generation for orders |
| **Authentication** | JWT & bcryptjs with HTTP-Only Cookies | Secure password hashing, session cookies, and Role-Based Access Control (RBAC) |

---

## 4. Key Features & Workflows

### 4.1 Student Experience
- **Campus Eatery Discovery (`/`)**: Browse Campus Canteen, Cozy Corner Cafe, and Highway Dhaba with live ratings, category filters, and operating hours.
- **Dynamic Menu & Cart (`/menu`)**: Browse all 20+ dishes with category tabs, search bar, live item quantity controls, and floating bottom order summary bar.
- **Order Checkout**: Choose Counter Pickup or Campus Room Delivery, enter special kitchen notes, and receive verified server-calculated pricing.
- **Real-Time Order Tracker (`/orders/[id]`)**: Visual stepper (`Received -> Confirmed -> Cooking & Prep -> Ready for Pickup -> Handed Over`), live countdown timer, and **PDF Receipt Download**.
- **Zaika AI Culinary Assistant**: Slide-out drawer powered by OpenAI and Google Gemini helping students find quick snacks under 5 minutes or late-night study study caffeine boosts.
- **Student Profile Modal**: View Student ID, Academic Year, Branch, Campus Email, and Order counts.

### 4.2 Canteen Owner & Kitchen Staff (`/canteen`)
- **Live Kitchen Order Board**: Accept incoming orders, transition dishes to "Cooking & Prep", mark "Ready for Pickup", or hand over to students.
- **Menu Management**: Add new items with image URL, prep time, price, and category; delete discontinued dishes in real-time.

### 4.3 Authentication & RBAC (`/login`)
- Dual-mode sliding Black & White interface for Student Login and Registration.
- Demo sign-in accounts:
  - **Student Demo**: `12345` / `pass123` (or `student1` / `pass123`)
  - **Canteen Manager Demo**: `admin` / `adminpass`

---

## 5. REST API Specifications

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new student account | Public |
| `POST` | `/api/auth/login` | Authenticate student or staff | Public |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile | Yes |
| `POST` | `/api/auth/logout` | Clear session cookie | Yes |
| `GET` | `/api/restaurants` | List eateries with category & search filter | Public |
| `GET` | `/api/restaurants/[id]` | Retrieve single restaurant and active dishes | Public |
| `GET` | `/api/menu-items` | Retrieve menu catalog with category filter | Public |
| `POST` | `/api/menu-items` | Add new menu item to live catalog | Canteen Staff / Admin |
| `DELETE` | `/api/menu-items/[id]` | Remove menu item | Canteen Staff / Admin |
| `POST` | `/api/orders` | Create order with server-verified prices & totals | Yes (Student) |
| `GET` | `/api/orders` | List user orders (or kitchen orders for staff) | Yes |
| `GET` | `/api/orders/[id]` | Get order details | Yes (Owner or Staff) |
| `PATCH` | `/api/orders/[id]` | Update order status in kitchen pipeline | Yes (Owner or Staff) |
| `GET` | `/api/orders/[id]/receipt` | Generate Puppeteer PDF or printable HTML receipt | Yes (Owner or Staff) |
| `POST` | `/api/ai/chat` | Conversational dish discovery (OpenAI / Gemini) | Public |
| `POST` | `/api/uploads` | Generate S3 presigned URL or upload buffer | Canteen Staff / Admin |
| `POST` | `/api/seed` | Seed database with initial eateries & 20+ dishes | Public |

---

## 6. Installation & Local Setup

### 6.1 Prerequisites
- Node.js `v20.0.0` or higher (tested on Node `v26.3.0`)
- npm `10+`
- (Optional) Local or remote MongoDB instance

### 6.2 Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in the environment variables:
- `MONGODB_URI`: MongoDB connection string (e.g. `mongodb://127.0.0.1:27017/food_ordering_platform`)
- `JWT_SECRET`: Secret key for JWT session tokens (at least 32 characters)
- `OPENAI_API_KEY`: (Optional) OpenAI API key
- `GOOGLE_GENERATIVE_AI_API_KEY`: (Optional) Google Gemini API key
- `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY`: (Optional) AWS S3 credentials (local buffer fallback is active if omitted)

### 6.3 Install Dependencies
```bash
npm install
```

### 6.4 Seed Database
Seed the database with the initial demo accounts (`12345`, `admin`), campus eateries, and 20+ legacy dishes:
```bash
curl -X POST http://localhost:3000/api/seed
```

### 6.5 Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6.6 Run Automated Tests
```bash
node tests/business-rules.test.mjs
```

### 6.7 Type Checking & Production Build
```bash
npm run type-check
npm run build
npm start
```

---

## 7. Verification Results

- **Automated Business Logic Suite**: 5/5 test groups passed (single item prep time, multi-item scaling factor, monetary calculations, state machine transitions, catalog integrity).
- **TypeScript Verification**: `npx tsc --noEmit` passed with 0 errors.
- **Next.js Production Build**: `npm run build` compiled 15/15 routes successfully.

