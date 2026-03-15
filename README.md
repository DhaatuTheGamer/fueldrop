# FuelDrop

[![CI](https://github.com/DhaatuTheGamer/fueldrop/actions/workflows/ci.yml/badge.svg)](https://github.com/DhaatuTheGamer/fueldrop/actions)

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
- **📊 Order Insights**: Comprehensive history of past and ongoing deliveries.
- **📱 Mobile-First Design**: Fully responsive UI built for the modern mobile user.

---

## 🛠 Tech Stack

| Technology | Purpose | Why? |
| :--- | :--- | :--- |
| **React 19** | UI Framework | Leverages the latest concurrent rendering features for a smooth UX. |
| **TypeScript** | Language | Ensures type safety and improves developer productivity. |
| **Vite** | Build Tool | Provides near-instant Hot Module Replacement (HMR) and optimized builds. |
| **Tailwind CSS** | Styling | Utility-first approach for rapid, consistent, and responsive UI development. |
| **Motion** | Animation | Adds fluid, premium micro-animations to improve user engagement. |
| **Lucide React** | Icons | A beautiful and consistent icon set for modern interfaces. |

---

## 🏁 Getting Started

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **Package Manager**: npm (v9+) or yarn
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

### Refueling Workflow

To order fuel, follow these simple steps:

1. **Select Vehicle**: Choose a registered vehicle from your garage.
2. **Set Amount**:
   ```typescript
   // Example of order state
   const order = {
     vehicleId: 'v123',
     amount: 50, // Liters
     type: 'volume'
   };
   ```
3. **Checkout**: Review the price breakdown including delivery fees.
4. **Track**: Monitor your "Captain" as they make their way to your location.

---

## 📂 Project Structure

```text
fueldrop/
├── src/
│   ├── components/     # Atomic UI components and layout wrappers
│   ├── context/        # Global state management (Auth, Theme, Cart)
│   ├── App.tsx         # Root component & Routing
│   ├── main.tsx        # Entry point
│   └── types.ts        # Shared TypeScript interfaces
├── public/             # Static assets (images, pwa icons)
├── vite.config.ts      # Build configuration
└── tsconfig.json       # TypeScript compiler settings
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

*Note: Unit tests with Vitest/Jest are planned for future releases.*

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for the full text.

---

<p align="center">
  Built with ❤️ by the FuelDrop Team
</p>
