# Refundid Warehouse Returns App

A mobile application prototype developed in **Expo (React Native)** for Refundid to approve/decline returns in warehouses. It solves their problem of typing in barcodes manually on a computer which is error-prone.

## Core Features

### Operator Login
- Operators log in by selecting their name from a simple dropdown, with no complex credentials required.

### Barcode Scanning
- Built-in barcode scanner with optional torch support for low-light warehouse conditions.
- Handles errors such as invalid barcodes and duplicate scans for processed orders.

### Instant Product & Customer Lookup
- After scanning, the app calls an API to fetch relevant product and customer details.
- Target loading time is **under 1.5 seconds** to maintain fast warehouse workflows.

### Approve or Decline Returns
- Operators can quickly approve or decline a return directly from the results screen.
- When a return is declined, the operator selects a reason, with optional photo upload for package issues.

## How to run

### Prerequisites
- Node.js from https://nodejs.org
- Expo Go app installed on a mobile device (compatible with IOS and Android)

### Steps to run

1. Install dependencies: 

    ```bash
    npm install
    ```
2. Start development server:

    ```bash
    npx expo start
    ```

3. Scan QR code provided in terminal using mobile device with Expo Go installed to explore project
4. [Sample Barcodes.pdf](Sample%20Barcodes.pdf) contains 3 valid barcodes

## Additional Learning Outcomes

### UI/UX Design Principles

This project required special attention to ensure the app speeds up return prcoessing:
- **Minimal-copy UI** intentionally designed for warehouse operators to ensure clear app flow.
- **Performance first** with short loading times and smooth transitions for quick processing of orders.

### Figma

The app interface was designed with Figma, which I used for the first time on this project: https://www.figma.com/design/5viI60axjdWWPszPi9HTL8/The-Careers-Department-x-Refundid-Wireframe-Template--Community-?node-id=0-1&t=LLsw9Snl2457PREs-1
