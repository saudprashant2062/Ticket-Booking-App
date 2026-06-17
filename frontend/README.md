# Ticket Booking Flow

A full-stack event ticket booking application built with the MERN stack. The application allows users to browse events, reserve seats for a limited time, and confirm bookings through a secure authentication system while preventing double bookings.

---

## Features

### Authentication

* User Registration
* User Login
* JWT-based Authentication
* Protected Routes

### Event Management

* View All Events
* View Event Details
* Display Event Venue and Date

### Seat Reservation

* Interactive Seat Grid
* Multiple Seat Selection
* Reserve Seats for 10 Minutes
* Reservation Countdown Timer
* Automatic Reservation Expiry

### Booking System

* Confirm Reserved Seats
* Prevent Double Booking
* Transaction-Based Booking Logic
* Real-Time Seat Availability Validation

### Error Handling

* Invalid Credentials
* Expired Reservations
* Unavailable Seats
* Unauthorized Access
* Network Error Handling

---

## Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* React Router DOM
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

---

## Project Structure

```text
Ticket Booking Flow
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   └── server.js
│   ├── .env
│   └── package.json
│
└── frontend
    ├── src
    │   ├── components
    │   ├── pages
    │   ├── services
    │   ├── context
    │   └── App.jsx
    └── package.json
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/ticket-booking-flow.git
cd ticket-booking-flow
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/eventbooking
JWT_SECRET=your_secret_key
```

Start Backend:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Events

```http
GET /api/events
GET /api/events/:id
```

### Reservations

```http
POST /api/reserve
```

### Bookings

```http
POST /api/bookings
```

---

## Seat Status

| Status    | Description                 |
| --------- | --------------------------- |
| Available | Seat can be reserved        |
| Reserved  | Temporarily held for a user |
| Booked    | Successfully purchased      |

---

## Key Technical Decisions

### Double Booking Prevention

MongoDB transactions and atomic updates are used to ensure that multiple users cannot reserve or book the same seat simultaneously.

### Reservation Expiry

Reservations automatically expire after 10 minutes. Expired reservations become invalid and seats are released back to the available pool.

### Authentication

JWT tokens are used to secure reservation and booking operations.

---

## Future Improvements

* Payment Gateway Integration
* Email Confirmation
* Real-Time Seat Updates with WebSockets
* Admin Dashboard
* Event Creation & Management
* Mobile Application

---

## Author

Prashant Saud

Built as a Full Stack Developer Hiring Assignment using the MERN Stack.
