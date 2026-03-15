
# FuelDrop

A modern, React-based fuel delivery application that brings convenience and transparency to fuel ordering. Users can seamlessly order fuel by liters or rupees, track deliveries in real-time, and manage their vehicles—all from their mobile devices. Built with a focus on speed, simplicity, and trust, FuelDrop simulates a complete fuel delivery experience with features like OTP authentication, live tracking, and order history.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Testing](#testing)
- [License](#license)

## Features

- **User Authentication**: Secure login with mobile OTP verification (simulated)
- **Vehicle Management**: Add, edit, and manage multiple vehicles
- **Fuel Ordering**: Order by liters or rupees with real-time price calculation
- **Live Tracking**: Real-time order tracking with captain assignment and ETA
- **Order History**: View ongoing and past orders
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **State Management**: Efficient global state using React Context API
- **Simulated Backend**: All operations use localStorage for demonstration

## Technologies Used

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router v7
- **State Management**: React Context API
- **AI Integration**: Google Gemini API (configured for future features)
- **Animation**: Motion library

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Google Gemini API key (optional, for future AI features)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DhaatuTheGamer/fueldrop.git
   cd fueldrop
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup** (Optional):
   - Create a `.env` file in the root directory
   - Add your Google Gemini API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```
   - **Important**: Add `.env` to your `.gitignore` to keep your API key secure

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## Usage

### Getting Started
1. Launch the app and view the splash screen
2. Enter your mobile number and verify with OTP (use "1234" for demo)
3. Set up your profile and add vehicles
4. Start ordering fuel!

### Key Workflows

**Ordering Fuel**:
- Select a vehicle from your garage
- Choose fuel quantity (liters) or amount (rupees)
- Review price breakdown and proceed to checkout
- Confirm order and track delivery in real-time

**Managing Vehicles**:
- Add new vehicles with make, model, and fuel type
- Edit existing vehicle details
- Remove vehicles you no longer need

**Tracking Orders**:
- View current order status and captain details
- Monitor ETA and delivery progress
- Rate your experience after completion

### Demo Features
This is a demonstration application with simulated features:
- OTP verification accepts "1234" as a valid code
- All data is stored locally in your browser
- Payment processing is UI-only
- Location services use browser geolocation or defaults
- Delivery tracking is simulated with timed status updates

## Project Structure

```
fueldrop/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React Context for state management
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   ├── index.css       # Global styles
│   └── types.ts        # TypeScript definitions
├── public/             # Static assets
├── index.html          # Main HTML file
├── package.json        # Dependencies and scripts
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## Contributing

We welcome contributions to improve FuelDrop! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** and ensure they follow our code style
4. **Run tests**: `npm run lint` to check for TypeScript errors
5. **Commit your changes**: `git commit -m 'Add some feature'`
6. **Push to the branch**: `git push origin feature/your-feature-name`
7. **Open a Pull Request**

### Guidelines
- Follow the existing code style and TypeScript conventions
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## Testing

Run the TypeScript compiler to check for type errors and potential issues:

```bash
npm run lint
```

This project currently uses TypeScript's built-in type checking. For comprehensive testing, consider adding unit tests with Jest and React Testing Library in future iterations.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**FuelDrop** - Bringing fuel delivery to your doorstep with modern web technology.
