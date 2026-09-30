# 🍃 SplitMint

> Smart Expense Sharing & Financial Tracking Application
> 
>[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-splitmint.rahulvaddi.me-6366f1?style=for-the-badge)](https://splitmint.rahulvaddi.me)
[![GitHub](https://img.shields.io/badge/GitHub-Rahulv--17%2FSplitMint-181717?style=for-the-badge&logo=github)](https://github.com/Rahulv-17/SplitMint)


SplitMint is a full-stack, real-time web application designed to make sharing expenses, managing group budgets, and tracking personal finances effortless. Whether you're splitting bills with roommates, planning a trip, or just keeping track of your budget, SplitMint has you covered.

## ✨ Key Features

- **📊 Comprehensive Dashboard & Analytics:** Visualize your expenses with interactive charts and keep track of your financial health.
- **👥 Group Management:** Create groups for trips, apartments, or events to easily manage shared expenses.
- **💸 Smart Expense Splitting & Settlements:** Add expenses and let SplitMint automatically calculate the most efficient way to settle up.
- **🔄 Recurring Expenses:** Automate your fixed monthly costs and subscriptions.
- **💰 Budget Tracking:** Set category-wise budgets and monitor your spending limits.
- **⚡ Real-time Updates:** Stay in sync with instant notifications and live updates powered by Socket.io.
- **🔐 Secure Authentication:** Seamless login via traditional Email/Password or Google OAuth.

## 🛠️ Technology Stack

### Frontend (Client)
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS, Framer Motion (Animations)
- **Routing:** React Router v7
- **Charts:** Recharts
- **State/Real-time:** Socket.io-client, Axios

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT, Google Auth Library, bcrypt
- **Real-time:** Socket.io
- **Emails:** Nodemailer

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   # cd to the project folder
   cd SplitMint/SplitMint
   ```

2. Install dependencies for the root, client, and server:
   ```bash
   # Install root dependencies (concurrently)
   npm install

   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   cd ..
   ```

3. Environment Variables setup:
   - In the `server` directory, create a `.env` file based on `.env.example` (add your MongoDB URI, JWT Secret, Google Client ID, etc.).
   - In the `client` directory, create a `.env` file for Vite variables (e.g., API URL).

### Running the Application

SplitMint uses `concurrently` to run both the client and server from the root directory seamlessly.

```bash
# In the root directory (where the root package.json is located)
npm run dev
```

- **Client:** `http://localhost:5173`
- **Server:** `http://localhost:5000`

## 📁 Project Structure

```text
SplitMint/
├── client/                 # Frontend React Application
│   ├── public/             # Static Assets
│   ├── src/                # React Components, Pages, Context, Hooks
│   ├── tailwind.config.js  # Tailwind Configuration
│   └── package.json        # Client Dependencies
├── server/                 # Backend Node.js/Express API
│   ├── config/             # Database and environment configurations
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom Express middlewares
│   ├── models/             # Mongoose Schemas (Activity, Budget, Category, Expense, Group, Settlement, User)
│   ├── routes/             # API Route definitions
│   ├── services/           # Business logic
│   ├── sockets/            # Real-time event handlers
│   ├── utils/              # Helper functions
│   └── package.json        # Server Dependencies
└── package.json            # Root configuration for running both environments
```

## 📜 License
This project is licensed under the ISC License.
