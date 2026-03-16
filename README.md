# FuelDrop

[![CI](https://github.com/DhaatuTheGamer/fueldrop/actions/workflows/ci.yml/badge.svg)](https://github.com/DhaatuTheGamer/fueldrop/actions)
![Version](https://img.shields.io/badge/version-2.0.0-E56B25)
![License](https://img.shields.io/badge/license-MIT-2B825B)

FuelDrop is a cutting-edge, React-powered fuel delivery platform that redefines how users refuel their vehicles. By bridging the gap between fuel stations and consumers, it offers an on-demand service that is both convenient and transparent.

## 🚀 The Problem & Solution

**The Problem:** Traditional refueling often involves long wait times, inconvenient detours, and lack of real-time tracking for businesses managing multiple vehicles.

**The Solution:** FuelDrop brings the fuel station to the user. Whether it's a single car at home or a fleet at a warehouse, FuelDrop provides a seamless ordering experience with real-time tracking, secure authentication, and comprehensive order history.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage Guide](#-usage-guide)
- [Captain Guide](#-captain-guide)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [Testing](#-testing)
- [License](#-license)

---

## ✨ Features

- **🔐 Secure Authentication**: Mobile-first OTP verification (simulated) for user security.
- **🚗 Vehicle Garage**: Add and manage profiles for multiple vehicles with specific fuel requirements.
- **⛽ Smart Ordering**: Precise ordering by volume (liters) or value (rupees) with dynamic pricing.
- **📍 Real-time Tracking**: Live delivery status updates, captain assignment, and ETA tracking.
- **📊 Order Insights**: Comprehensive history of past and ongoing deliveries with filters & search.
- **❤️ Favorite Orders**: Save and quickly reorder your most common fuel deliveries.
- **👨‍✈️ Captain Dashboard**: Dedicated interface for delivery partners to manage and fulfill orders.
- **🌙 Dark Mode**: Full light/dark theme support with a neo-brutalist design system.
- **⭐ Captain Rating**: Rate your delivery captain and leave tips after each order.
- **📱 Mobile-First Design**: Fully responsive UI built for the modern mobile user.

---

## 🛠 Tech Stack

| Technology | Purpose | Why? |
| :--- | :--- | :--- |
| **React 19** | UI Framework | Leverages the latest concurrent rendering features for a smooth UX. |
| **TypeScript** | Language | Ensures type safety and improves developer productivity. |
| **Vite** | Build Tool | Provides near-instant Hot Module Replacement (HMR) and optimized builds. |
| **Tailwind CSS 4** | Styling | Utility-first approach for rapid, consistent, and responsive UI development. |
| **Motion** | Animation | Adds fluid, premium micro-animations to improve user engagement. |
| **Lucide React** | Icons | A beautiful and consistent icon set for modern interfaces. |

---

## 🏁 Getting Started

### Prerequisites

- **Node.js**: Version 22.0 or higher (LTS recommended)
- **Package Manager**: npm (v10+) or yarn
- **Browser**: Modern evergreen browser (Chrome, Edge, Firefox, Safari)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DhaatuTheGamer/fueldrop.git
   cd fueldrop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Launch Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📖 Usage Guide

### User Journey: Refueling Made Simple

Follow these steps to get fuel delivered to your doorstep:

1. **Secure Login**: Enter your mobile number and authenticate using the test OTP `1234`.
2. **Add Your Fleet**: Navigate to the **Garage** to add your vehicles. FuelDrop supports multiple vehicle profiles.
3. **Place an Order**: 
    - Select a vehicle from your garage.
    - Choose your fuel type (Petrol/Diesel/Power).
    - Specify quantity by **Volume** (Liters) or **Value** (Rupees).
4. **Instant Checkout**: Review the transparent pricing, including delivery fees and taxes.
5. **Live Tracking**: Once a Captain accepts, track their real-time location and estimated arrival time on the map.
6. **Completion & Feedback**: After delivery, rate your experience and leave a tip for your Captain.

---

## 👨‍✈️ Captain Guide

### Fulfilling Orders

The Captain App is a dedicated interface for our delivery partners to manage their workflow.

**Accessing the Captain App:**
Navigate to `http://localhost:3000/captain` to access the Captain Dashboard. This route is publicly accessible for testing and demonstration purposes.

**Captain Workflow:**
1.  **Dashboard Overview**: View available orders in your vicinity with details like fuel type, quantity, and distance.
2.  **Accepting Orders**: Tap **"Accept Order"** to claim a delivery.
3.  **Status Management**: Update the order status as you progress:
    - **Pick Up**: Mark when you've reached the station.
    - **In Transit**: Mark when you are on your way to the user.
    - **Arrived**: Notify the user when you've reached the delivery location.
4.  **Order Completion**: Finalize the delivery once the fuel is dispensed.
5.  **Earnings Tracking**: (Coming Soon) Track your daily earnings and completed trips.

---

## 📂 Project Structure

```text
fueldrop/
├── src/
│   ├── components/     # UI components (Login, Home, Garage, OrderFuel, etc.)
│   ├── context/        # Global state management (AppContext)
│   ├── App.tsx         # Root component & view routing
│   ├── main.tsx        # Entry point
│   ├── index.css       # Design system (Tailwind theme, brutalist utilities)
│   └── types.ts        # Shared TypeScript interfaces
├── .github/
│   └── workflows/      # CI pipeline (lint + build)
├── index.html          # HTML entry with SEO meta tags
├── vite.config.ts      # Build configuration
├── tsconfig.json       # TypeScript compiler settings
└── package.json        # Dependencies & scripts
```

---

## 🤝 Contributing

We love contributions! Whether it's a bug fix, a new feature, or improved documentation, satisfy your curiosity by helping us build FuelDrop.

1. **Fork** the project.
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`).
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4. **Push** to the branch (`git push origin feature/AmazingFeature`).
5. **Open** a Pull Request.

Please adhere to our [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md).

---

## 🧪 Testing

Maintain high code quality by running our validation suite:

```bash
# Run TypeScript type-checking
npm run lint

# Verify the production build
npm run build
```

*Note: Unit tests with Vitest are planned for future releases.*

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for the full text.

---

<p align="center">
  Built with ❤️ by the FuelDrop Team
</p>
