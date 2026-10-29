# Food Ordering Platform (Cd: Zaika) — Initial Audit & Modernization Plan

**Date:** October 2026  
**Auditor:** AI Systems Architect  
**Repository:** https://github.com/Piyush-Sharma788/Food_Ordering_Platform  
**Reference Standards:** `GEMINI.md` and `companyguielsline.md`

---

## 1. Executive Summary

An exhaustive audit of the Food Ordering Platform repository was conducted. The repository originally consists of five static HTML files containing inline CSS, Boxicons/FontAwesome references, and mock client-side JavaScript. 

The application is themed around **"Cd: Zaika"** (also branded as **"Campus da: Zaika"**), a campus-focused food ordering platform connecting students and faculty with on-campus and nearby eateries (such as Campus Canteen, Cozy Corner Cafe, and Highway Dhaba). 

The goal of this project is to modernize this legacy static prototype into a scalable, secure, AI-powered full-stack application using **Next.js (App Router), React, TypeScript, REST APIs, MongoDB, OpenAI & Google Generative AI, AWS S3, and Puppeteer**, while preserving the original design identity, branding, menu catalog, preparation-time algorithms, and business logic.

---

## 2. Existing Codebase Audit

### 2.1 File Inventory & Capabilities

| File | Lines | Purpose & Features in Current State | Architectural Gaps & Risks |
|---|---|---|---|
| `Final_home.html` | 375 | Home landing page for "Cd: Zaika". Features eatery cards (Campus Canteen, Cozy Corner Cafe, Highway Dhaba, etc.) with star ratings, descriptions, image previews, and eatery category badges. Includes a floating student profile modal displaying Student ID, Academic Year, Branch, Email, and Order counts based on in-memory JS user objects. | Pure client-side static HTML. Profile data is hardcoded in JavaScript; eatery links navigate via relative HTML filenames; no live database connectivity; no server-side auth check. |
| `final_menu.html` | 714 | Interactive menu page with 20+ items (shakes, coffees, burgers, momos, pizzas, noodles, etc.). Includes quantity increment/decrement, dynamic calculation of preparation time using formula: `totalTime += item.time + (item.time * 0.35 * (qty - 1))`, fixed bottom order summary, and a mock "Pay Now" alert checkout. Links to reviews. | Prices and totals calculated strictly in client browser; no server validation; arbitrary price tampering possible; no order persistence in database; no transactional safety. |
| `FINAL_LOGIN.html` | 416 | Elegant split-card animated sliding Login and Sign-Up interface (Black/White high-contrast theme). In-memory mock authentication: `student1`, `student2` redirect to `Final_home.html`, and `admin` redirects to `canteen.html`. | Passwords stored and checked in plaintext in client-side script; no password hashing; no sessions, cookies, or JWTs; no server-side role-based access control (RBAC). |
| `canteen.html` | 188 | Canteen Owner / Manager dashboard. Lists existing menu items, allows deleting items, and contains a form to add new items (name, description, price, prep time, image URL). Footer contains contact info (`cd.ugi@gmail.com`). | Item additions and deletions occur solely in memory (`menuItems.splice()`); changes vanish on page refresh; no restaurant authorization or authentication checks. |
| `final about us.html` | 218 | About Us & Contact page with sticky navigation. Highlights company mission, leadership team (Tanishq Soni, Akash Singh, Daksh Sharma), and includes a customer inquiry contact form. | Form submissions do not connect to any backend API or email service; team images contain placeholder URLs. |

### 2.2 Preserved Domain Logic & Data Assets

The following business rules and data assets were extracted from the legacy application and will be preserved and upgraded:
1. **Catalog of Eateries**:
   - Campus Canteen (Canteen, 4.0 rating, quick bites and affordable meals)
   - Cozy Corner Cafe (Cafe, 4.8 rating, artisanal coffee and pastries)
   - Highway Dhaba (Dhaba, 4.2 rating, authentic roadside cuisine)
2. **Catalog of 20+ Menu Items**:
   - Vanilla Shake (₹65, 4 min), Strawberry Shake (₹70, 4 min), Chocolate Shake (₹90, 4 min), Hot Coffee (₹25, 3 min), Hot Hazelnut Coffee (₹30, 4 min), Cold Coffee (₹50, 5 min), Hazelnut Cold Coffee (₹60, 5 min)
   - Paneer Burger (₹75, 8-10 min), Grilled Sandwich (₹55, 8.5 min), Paneer Sandwich (₹70, 10 min), Cheese Bun (₹35, 5.5 min), French Fries (₹50, 5.5 min), Chilly Potato Gravy (₹65, 7 min), Chilly Paneer (₹80, 5.5 min)
   - Maggie Masaledar (₹60, 10 min), Chilly Paneer Maggie (₹70, 10 min), Noodles (₹50, 10 min), Paneer Noodles (₹70, 12 min), Steam Momos (₹30, 5 min), Fried Momos (₹40, 6 min), Kulhad Pizza (₹140, 15 min), Salad (₹15, 6 min), Idli (₹40, 4 min), Cheese Corn Pizza (₹145, 15 min), Onion Capsicum Pizza (₹160, 15 min), Paneer Pizza (₹170, 15 min)
3. **Preparation Time Calculation Model**:
   - Single item: `prepTime = baseTime`
   - Multiple items of same kind: `prepTime = baseTime + baseTime * 0.35 * (qty - 1)`
   - Order total preparation time: estimated based on maximum parallel station preparation or aggregate formula.
4. **Visual Aesthetic & Styling**:
   - Modern minimalist monochrome palette (Deep Black `#000000`, Crisp White `#ffffff`, Accent `#17a` / Slate `#333333`).
   - Clean typography with hover transitions, badge labels, and accessible layouts.

---

## 3. Technology Stack & Target Architecture

Per `GEMINI.md` and `companyguielsline.md`, the platform is being transitioned into a modern unified Next.js + TypeScript full-stack modular architecture:

```
+-----------------------------------------------------------------------------------+
|                            Next.js 14+ App Router                                 |
|                                                                                   |
|  Presentation Layer (React 18 / Tailwind CSS / Lucide Icons)                      |
|  - Customer Portal: Home, Eatery Details, Dynamic Menu, Live Cart, Checkout,      |
|                     Order Tracker, Student Profile, About Us, Reviews             |
|  - AI Assistant Drawer: Conversational Discovery & Dietary Advisor                |
|  - Canteen Staff / Owner Portal: Menu Management, Order Live Board, Status Updates|
|  - Platform Admin: User & Eatery Oversight, Platform Audit Logs                   |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                          REST API (Next.js Route Handlers)                        |
|  - /api/auth (register, login, me, logout - JWT / Secure HTTP-Only Cookies)       |
|  - /api/restaurants (listings, details, search, filters)                          |
|  - /api/menu-items (CRUD, availability toggles, category filtering)               |
|  - /api/orders (creation, state machine transitions, user order history)          |
|  - /api/ai/chat (conversational food ordering assistant, recommendations)         |
|  - /api/ai/suggest-menu (AI description & nutrition generation)                   |
|  - /api/uploads (AWS S3 presigned URLs & safe image uploads)                      |
|  - /api/orders/[id]/receipt (Puppeteer PDF receipt generator)                     |
|  - /api/reviews (review submission and retrieval)                                 |
+--------------------+--------------------+--------------------+--------------------+
                     |                    |                    |
                     v                    v                    v
+--------------------+---+  +-------------+-----+  +-----------+-----+  +-----------+
|     MongoDB &          |  | Dual AI Adapters: |  | Storage & S3:   |  | Puppeteer |
|     Mongoose           |  | - OpenAI API      |  | - AWS S3 Upload |  | Receipt   |
|  - Users               |  | - Google Gemini   |  | - Safe Fallback |  | & Invoice |
|  - Restaurants         |  |   (Generative AI) |  |   Buffer Engine |  | PDF Engine|
|  - MenuItems           |  | - Fallback Router |  +-----------------+  +-----------+
|  - Orders & Reviews    |  +-------------------+
+------------------------+
```

---

## 4. Phased Modernization Plan

- **Phase 1: Project Scaffolding & Core Architecture Setup**
  - Initialize Next.js with TypeScript, Tailwind CSS, ESLint, and configuration.
  - Setup environment variable definitions (`.env.example`) and verification.
  - Install core production dependencies: `mongoose`, `jsonwebtoken`, `bcryptjs`, `zod`, `openai`, `@google/generative-ai`, `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `puppeteer-core` / `puppeteer`.

- **Phase 2: Database Layer & Data Modeling**
  - Implement MongoDB connection manager with connection caching.
  - Create robust Mongoose schemas: `User`, `Restaurant`, `MenuItem`, `Order`, `Review`.
  - Create database seeding script populated with the complete catalog of legacy restaurants and 20+ dishes.

- **Phase 3: Authentication & Role-Based Access Control (RBAC)**
  - Implement secure password hashing (`bcryptjs`) and JWT authentication in HTTP-Only cookies.
  - Support Student ID / Email logins and role separation (`customer`, `canteen_owner`, `admin`).
  - Auth route handlers: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`.

- **Phase 4: Business Logic Services & REST API Routes**
  - Server-side restaurant & menu item services with category filtering and search.
  - Order processing service with server-side price verification and state machine transitions:
    `pending -> confirmed -> preparing -> ready_for_pickup -> completed / cancelled`.
  - Idempotency and atomic updates to prevent race conditions or duplicate submissions.

- **Phase 5: External Infrastructure Integration (AI, AWS S3, Puppeteer)**
  - Dual AI adapter layer supporting both OpenAI and Google Generative AI with automatic fallback.
  - AI endpoints for natural language food discovery and dish recommendations.
  - AWS S3 service for menu/eatery photo uploads with validation and safe local fallback.
  - Puppeteer PDF receipt generator for download of order invoices.

- **Phase 6: Frontend Experience & UI Modernization**
  - Responsive, high-contrast monochrome design inspired by `FINAL_LOGIN.html`, `Final_home.html`, and `final_menu.html`.
  - Interactive Menu with live preparation time computation, filter tabs, and cart sidebar.
  - Checkout modal with address/pickup station selection and server-verified bill summary.
  - Real-time Order Tracking screen with status progress bar and PDF receipt download button.
  - Canteen Management Dashboard for menu additions, deletions, and live incoming order management.
  - AI Assistant drawer ("Zaika AI") for natural language food discovery.

- **Phase 7: Verification, Testing & Production Build**
  - Comprehensive unit and integration test scripts.
  - Type checking (`tsc --noEmit`), linting, and Next.js production build (`npm run build`).
  - Comprehensive documentation updates (`README.md`, `GEMINI.md`, API documentation).

---

## 5. Potential Regressions & Mitigations

1. **Lost Menu Items or Changed Prices**: All 20+ original menu items from `final_menu.html` and eateries from `Final_home.html` are codified directly into database seeds and default data fixtures.
2. **Loss of Static Files**: Original `.html` files are retained in the repository so git history and legacy references remain completely intact.
3. **Offline or Missing Cloud Credentials**: Dual AI adapters, S3 storage, and Puppeteer are designed with graceful offline mock fallbacks so the application functions seamlessly in all environments without crashes.

