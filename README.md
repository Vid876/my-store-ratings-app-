Store Ratings Web Application
This project is a full-stack web application developed as a solution to a coding challenge. It serves as a store rating platform that supports three distinct user roles: System Administrator, Normal User, and Store Owner. The application is built using React for the frontend, Node.js with Express for the backend, and MySQL for the database.

✨ Features
👤 System Administrator
Add new stores, normal users, and other admin users.

View a dashboard with total users, stores, and ratings.

View and filter lists of all users and stores.

Manage user and store details.

🧑 Normal User
Sign up and log in to the platform.

View a list of all registered stores.

Search for stores by name and address.

Submit and modify ratings (1-5) for stores.

🏪 Store Owner
Log in to the platform.

View a dashboard with the average rating of their store.

See a list of all users who have rated their store.

🛠️ Tech Stack
Frontend: React.js, Tailwind CSS, Axios

Backend: Node.js, Express.js

Database: MySQL

Authentication: bcrypt.js (for password hashing), jsonwebtoken (for session management)

🚀 Getting Started & How to Run
Project ko apne local machine par chalaane ke liye neeche diye gaye steps follow karein.

Prerequisites
Node.js (version 14 ya usse upar)

Git

MySQL (MySQL Server aur MySQL Workbench)

1. Project Setup
# 1. Repository ko clone karein
git clone [https://github.com/aapka-username/store-ratings-app.git](https://github.com/aapka-username/store-ratings-app.git)

# 2. Project folder mein jaayein
cd store-ratings-app

2. Backend Setup
# 1. Backend folder mein jaayein
cd backend

# 2. Saare zaroori packages install karein
npm install

# 3. MySQL mein database banayein
#    - MySQL Workbench ya command line se 'store_ratings_db' naam ka ek naya database banayein.
#    - Database ke andar users, stores, aur ratings tables banayein.
#      (Aap project mein di gayi SQL file ka istemal kar sakte hain)

# 4. server.js file mein database credentials set karein
#    - backend/server.js file kholein.
#    - db.createConnection({...}) ke andar apna MySQL username aur password daalein.

3. Frontend Setup
# 1. Main project folder mein wapas aayein
cd ..

# 2. Frontend folder mein jaayein
cd my-store-ratings-app

# 3. Saare zaroori packages install karein
npm install

4. Running the Application
Aapko do alag-alag terminal ki zaroorat padegi.

Terminal 1: Backend Server Start Karein

# Backend folder mein jaayein
cd backend

# Server start karein
node server.js

# Aapko yeh message dikhna chahiye:
# Server is running on port 5001
# Successfully connected to the database.

Terminal 2: Frontend Server Start Karein

# Frontend folder mein jaayein
cd my-store-ratings-app

# React app start karein
npm start

# Aapka browser http://localhost:3000 par automatically khul jaayega.
