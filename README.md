# Logistics Dashboard (Frontend) 

This is the User Interface for the Logistics Application, built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS**. It allows users to view inventory and manage orders.

## Prerequisites
- **Node.js** (v18 or higher recommended)
- **The Backend Service** must be running (see `logistics-service` repo)

## Quick Start Commands

### 1. Install Dependencies
Run this in the project folder to install React and Tailwind packages:
```bash
npm install
```

### 2. Start the App
Run this to launch the local development server:
```bash
npm run dev
```

The Dashboard will open at http://localhost:5173.

#### Configuration
Connecting to Backend: By default, this frontend tries to connect to the backend at http://localhost:3000

If your backend is running on a different port, update the configuration in src/App.tsx:

TypeScript
```bash
// src/App.tsx
const API_BASE = 'http://localhost:8001'; // Update this number to match your Docker port
```

### Features
Inventory List: Real-time view of product stock.

Order Management: View order statuses.

Shipping Actions: Button to update order status from "Pending" to "Shipped".