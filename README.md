# Cd: Zaika — Modernized Food Ordering & Campus Kitchen Management Platform

> *"Flavours that fuel your study delivered with care"*

![Cd: Zaika](https://upload.wikimedia.org/wikipedia/commons/f/f2/Infosys.Electronic.City.Cafeteria.JPG)

## 1. Project Overview

**Cd: Zaika** (also known as **Campus da: Zaika**) is a modern full-stack campus food ordering and kitchen management platform designed specifically for students, faculty, and canteen operators.

The platform is powered by **Django 5 & Python 3.11+**, incorporating **Django Templates, Django ORM (SQLite), Django REST Framework (DRF), OpenAI & Google Gemini AI adapters, ReportLab PDF receipt generation, and AWS S3 storage**.

---

## 2. Preserved Business Logic & Campus Heritage

All core features, mathematical models, and domain logic from the original prototype have been preserved and modernized:

1. **Complete 26-Dish Campus Menu**:
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
| **Framework & Language** | Django 5.1+, Python 3.11+ | High-performance full-stack web framework |
| **Presentation / UI** | Django Templates, HTML5, CSS3, JavaScript | Responsive, high-contrast monochrome design system |
| **API Layer** | Django REST Framework (DRF) | Resource-oriented REST APIs for restaurants, menu, orders, and AI |
| **Database & ORM** | SQLite via Django ORM | Zero-setup, transactional database with native migrations |
| **Artificial Intelligence** | OpenAI (`gpt-4o-mini`) & Google Gemini (`gemini-1.5-flash`) | Reusable Python adapters with automatic fallback and grounded menu discovery |
| **Document Generation** | ReportLab | Fast, high-resolution vector PDF receipt and invoice generation |
| **File Storage** | AWS S3 (`boto3`) | Menu and eatery photo uploads with automatic local media fallback |
| **Authentication & RBAC** | Django Auth & Sessions | Role-based access control (`customer`, `canteen_owner`, `admin`) with Student ID login |

---

## 4. Key Features & Workflows

### 4.1 Student Experience
- **Campus Eatery Discovery (`/`)**: Browse Campus Canteen, Cozy Corner Cafe, and Highway Dhaba with live ratings, category filters, and operating hours.
- **Dynamic Menu & Cart (`/menu/`)**: Browse all 26 dishes with category tabs, search, item quantity controls, and floating bottom order summary bar.
- **Order Checkout**: Choose Counter Pickup or Campus Room Delivery, enter special kitchen notes, and receive verified server-calculated pricing.
- **Real-Time Order Tracker (`/orders/<order_number>/`)**: Visual stepper (`Received -> Confirmed -> Cooking & Prep -> Ready for Pickup -> Handed Over`), live countdown timer, and **Download PDF Receipt** button.
- **Zaika AI Culinary Assistant**: Slide-out drawer powered by OpenAI and Google Gemini helping students find quick snacks under 5 minutes or late-night study study caffeine boosts.
- **Student Profile Modal**: View Student ID, Academic Year, Branch, Campus Email, and Order counts.

### 4.2 Canteen Owner & Kitchen Staff (`/canteen/`)
- **Live Kitchen Order Board**: Accept incoming orders, transition dishes to "Cooking", mark "Ready for Pickup", or hand over to students.
- **Menu Management**: Add new items with image URL, prep time, price, and category; delete discontinued dishes in real-time.

### 4.3 Django Admin Oversight (`/admin/`)
- Full platform administration for users, eateries, menu catalog, orders, and reviews.

### 4.4 Authentication & RBAC (`/login/`)
- Dual-mode sliding Black & White interface for Student Login and Registration.
- Instant demo sign-in accounts:
  - **Student Demo**: `12345` / `pass123` (or `67890` / `pass456`)
  - **Canteen Manager Demo**: `admin` / `adminpass`

---

## 5. REST API Specifications

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register/` | Register new student account | Public |
| `POST` | `/api/auth/login/` | Authenticate student or staff | Public |
| `GET` | `/api/auth/me/` | Retrieve authenticated user profile | Yes |
| `POST` | `/api/auth/logout/` | End user session | Yes |
| `GET` | `/api/restaurants/` | List eateries with category & search filter | Public |
| `GET` | `/api/restaurants/<id>/` | Retrieve single eatery and its menu items | Public |
| `GET` | `/api/menu-items/` | Retrieve menu catalog with category filter | Public |
| `POST` | `/api/menu-items/` | Add new menu item to live catalog | Canteen Staff / Admin |
| `DELETE` | `/api/menu-items/<id>/` | Remove menu item | Canteen Staff / Admin |
| `POST` | `/api/orders/` | Create order with server-verified prices & totals | Yes (Student) |
| `GET` | `/api/orders/` | List user orders (or kitchen orders for staff) | Yes |
| `GET` | `/api/orders/<order_number>/` | Get order details | Yes (Owner or Staff) |
| `PATCH` | `/api/orders/<order_number>/` | Update order status in kitchen pipeline | Yes (Owner or Staff) |
| `GET` | `/orders/<order_number>/receipt/pdf/` | Download ReportLab PDF receipt | Yes (Owner or Staff) |
| `GET` | `/orders/<order_number>/receipt/html/` | Printable HTML receipt | Yes (Owner or Staff) |
| `POST` | `/api/ai/chat/` | Conversational dish discovery (OpenAI / Gemini) | Public |
| `GET` | `/api/reviews/` | View student ratings and reviews | Public |

---

## 6. Installation & Local Development Setup

### 6.1 Prerequisites
- Python `3.10+` (tested on Python `3.11.16`)
- pip

### 6.2 Environment Setup
Create and activate a virtual environment:
```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

### 6.3 Database Migrations & Initial Seeding
Apply SQLite migrations:
```bash
python manage.py migrate
```

Seed initial eateries, 26 legacy dishes, and demo users:
```bash
python manage.py seed_data
```

### 6.4 Run Development Server
```bash
python manage.py runserver 8000
```
Open [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser.

### 6.5 Run Automated Test Suite
```bash
python manage.py test
```

---

## 7. Verification Results

- **Automated Test Suite (`python manage.py test`)**: **10/10 PASS (OK)**
  - Single item prep time calculation
  - Multi-item quantity scaling formula ($0.35$ factor)
  - Order subtotal, 5% campus tax, delivery fee, and grand total calculations
  - ReportLab PDF byte stream integrity (`%PDF-` format validation)
  - Homepage, Menu, and About template rendering
  - DRF Restaurant list and Menu item listing
  - AI chat fallback assistant
  - Order creation endpoint and transaction verification
- **Django System Check (`python manage.py check`)**: **0 issues identified**
