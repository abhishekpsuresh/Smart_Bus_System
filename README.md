# Smart Bus System

A full-stack web application for online bus reservation and management. The system provides separate portals for Users, Bus Operators, and Administrators, allowing efficient trip management, seat booking, payment processing, reservation monitoring, and user management.

---

## Project Overview

Smart Bus System is designed to modernize bus transportation services by providing a centralized platform where:

* Users can search buses, reserve seats, and manage bookings.
* Bus Operators can manage buses, trips, and reservations.
* Administrators can monitor the entire system, manage users, operators, buses, and trips.

The project follows a role-based access control system and includes security validations for authentication and authorization.

---

## Features

### User Features

* User Registration and Login
* Search Available Trips
* View Bus Details
* Seat Selection
* Passenger Information Management
* Online Reservation
* Payment Processing
* View Booking History
* Cancel Bookings
* Reservation Timer System

### Operator Features

* Operator Registration Request
* Operator Login
* Bus Management
* Trip Management
* View Reservations
* Manage Bookings
* View Cancelled Bookings

### Admin Features

* Secure Admin Login
* Dashboard Analytics
* User Management
* Bus Monitoring
* Trip Monitoring
* Booking Monitoring
* Operator Request Approval/Rejection
* System-wide Control

---

## Security Features

* JWT Authentication
* Password Hashing using bcrypt
* Role-Based Access Control (RBAC)
* Protected Routes
* Input Validation
* Secure Login System
* Reservation Expiry Handling

---

## Technology Stack

### Frontend

* React.js
* Vite
* Axios
* React Router
* CSS

### Backend

* Node.js
* Express.js
* JWT
* bcrypt

### Database

* MySQL

---

## Project Structure

SmartBusSystem/

├── backend/

├── frontend/

├── database/

├── docs/

├── deployment/

└── README.md

---

## Installation Guide

### 1. Clone Repository

```bash
git clone https://github.com/abhishekpsuresh/Smart_Bus_System.git
cd Smart_Bus_System
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=BusProject@123
DB_NAME=smart_bus_system
DB_PORT=3306
JWT_SECRET=smartbussecretkey
```

Start Backend:

```bash
npm start
```

or

```bash
node src/server.js
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## Database Setup

1. Open MySQL Workbench.
2. Create database:

```sql
CREATE DATABASE smart_bus_system;
```

3. Import:

```text
database/smart_bus.sql
```

4. Refresh schemas.

---

## Default Admin Account

```text
Full Name : Abhishek P Suresh
Email     : abhishekpsuresh@admin.com
Password  : Kl32l5274@@@
Role      : Admin
```

---

## Modules Implemented

### Authentication Module

* User Signup
* User Login
* Operator Login
* Admin Login
* JWT Authentication

### Reservation Module

* Seat Reservation
* Passenger Details
* Reservation Timer
* Booking Confirmation

### Bus Management Module

* Add Bus
* Update Bus
* Delete Bus
* Bus Image Support

### Trip Management Module

* Add Trips
* Update Trips
* Monitor Trips

### Monitoring Module

* User Monitoring
* Bus Monitoring
* Trip Monitoring
* Booking Monitoring

---

## Testing

The system has been tested for:

* Authentication Validation
* Role-Based Access
* Seat Reservation
* Booking Flow
* Cancellation Flow
* Admin Controls
* Operator Controls
* Database Connectivity

---

## Future Enhancements

* Live Bus Tracking
* GPS Integration
* Email Notifications
* SMS Notifications
* UPI Payment Gateway
* Mobile Application
* AI-Based Route Recommendation

---

## Developer

**Abhishek P Suresh**

Bachelor of Computer Applications (BCA)

Capstone Project – Smart Bus System

---

## License

This project is developed for educational and academic purposes.
