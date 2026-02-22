# 💇‍♀️ MySalon – Full-Stack Appointment Scheduling Platform

Simplify barber appointment booking with a smart full-stack platform.
MySalon is a cloud-ready full-stack appointment scheduling system built using the MERN stack.
It allows customers to book barber appointments seamlessly while enabling barbers to manage services, appointments, business insights, and availability through a secure dashboard.

---

# 🚀 Features

## 👤 Customer Features
- 📅 Select date and time slots
- 💈 Browse available services
- ✅ Book appointments instantly
- 📱 Responsive and user-friendly interface

## 💼 Barber Dashboard
- 🔐 Secure barber login (accessible via footer)
- 📊 View all booked appointments
- 🛠️ Manage services (Create, Read, Update, Delete)
- 📈 Track monthly earnings & analytics
- 📜 View complete appointment history
- 🗓️ Add leave and block unavailable dates
- 🚫 Prevent double booking conflicts

---

# 🧰 Tech Stack

- MongoDB – Database
- Express.js – Backend framework
- React.js – Frontend library
- Node.js – Backend runtime
- Docker – Containerization
- REST API – Backend communication

---

# 💻 How to Run the Website Locally

1. **Clone the repository**
```bash
git clone https://github.com/RuchiGupta/barber-booking.git
cd barber-project
```
2. **Run the project using Docker (Recommended)**
Make sure Docker and Docker Compose are installed and running.
```bash
docker-compose up --build
```
3. **Access the application**
```bash
Frontend:
http://localhost:5173/
Backend API:
http://localhost:5000/
```

---

# 🔐 Environment Setup
Create a .env file inside the backend folder:
```bash
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

---

# 📁 Project Structure
```bash
Barber booking
├── backend
│   ├── models
│   ├── routes
│   ├── controllers
│   └── server.js
├── frontend
│   ├── components
│   ├── pages
│   └── dashboard
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

# 📌 Example Workflow

## Customer Side
  1. Browse services  
  2. Select date and available time slot  
  3. Confirm booking  
  4. Appointment stored in MongoDB
## Barber Side
  1. Login via footer
       (EXAMPLE EMAIL: beautician@example.com, EXAMPLE PASS: 123456)
  2. View appointments in dashboard
  3. Manage services (CRUD)
  4. track performance  
  5. Add leave to block availability
