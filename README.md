💇‍♀️ My Salon – Full-Stack Appointment Booking System

My Salon is a modern full-stack salon appointment booking platform built using the MERN stack.
It allows customers to book salon services online while enabling the admin to manage appointments, services, and availability through a secure dashboard.

🚀 Features
👩‍💻 Customer Features

📅 Select preferred date and time slot

💄 Browse available salon services

📝 Book appointments instantly

📱 Fully responsive user interface

⚡ Smooth and fast booking experience

🔐 Admin Dashboard Features

🔑 Secure Admin Login

📊 View all booked appointments

🛠️ Manage Services (Create, Read, Update, Delete)

📆 Block unavailable dates

🚫 Prevent double booking conflicts

📈 Track and manage all customer bookings

🧰 Tech Stack

MongoDB – Database

Express.js – Backend Framework

React.js – Frontend Library

Node.js – Backend Runtime

REST API – Communication between frontend & backend

Docker – Containerization

💻 How to Run the Website Locally
Clone the repository

git clone https://github.com/RuchiGupta1804/my-salon.git

cd my-salon

Run the project using Docker (Recommended)

Make sure Docker and Docker Compose are installed and running.

docker-compose up --build

Access the application

Frontend:
http://localhost:5173/

Backend API:
http://localhost:5000/

🔐 Environment Setup

Create a .env file inside the backend folder:

MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key

📁 Project Structure

My Salon
├── backend
│ ├── models
│ ├── routes
│ ├── controllers
│ ├── middleware
│ └── server.js
├── frontend
│ ├── components
│ ├── pages
│ ├── context
│ └── App.jsx
├── docker-compose.yml
├── Dockerfile
└── README.md

📌 Example Workflow
👩 Customer Side

Browse available salon services

Select preferred date & available time slot

Confirm booking

Appointment stored in MongoDB database

🔐 Admin Side

Login securely

View appointments in dashboard

Manage services (Add / Edit / Delete)

Block unavailable dates

Monitor all customer bookings

🎯 Project Highlights

Demonstrates full MERN stack implementation

Real-world CRUD operations

Authentication & protected routes

REST API integration

Dockerized application setup
