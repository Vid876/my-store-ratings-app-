⭐ Store Ratings Web Application

The Store Ratings Web Application is a full-stack project developed as a solution to a coding challenge. It is designed to provide a seamless platform where users can explore, review, and rate stores, while administrators and store owners can manage their respective operations. The system is role-based and supports three types of users: System Administrators, Normal Users, and Store Owners.

This project demonstrates the integration of a React frontend, Node.js backend, and MySQL database into a scalable, secure, and user-friendly platform. It also showcases modern web development practices, including authentication, authorization, and modular design.

*************************************************************************************************************************

✨ Key Features
👤 System Administrator

The system administrator has complete control over the platform. They can create new stores, manage users (both normal users and other administrators), and oversee the entire system. The admin dashboard provides a clear overview of total users, registered stores, and ratings submitted. Administrators can also filter, update, and manage user/store details, ensuring smooth operation of the application.

**********************************************************************************************************************

🧑 Normal User

Normal users are the end-users of the platform. They can register and log in securely, browse through the list of registered stores, and search for stores by name or address. Each user can rate stores on a scale of 1 to 5 and even modify their ratings if needed. This makes the platform interactive and encourages continuous engagement.



🏪 Store Owner

Store owners benefit from a personalized dashboard that highlights the performance of their store. They can log in, view the average rating of their store, and analyze user feedback. This helps them understand customer satisfaction and make improvements to enhance their services.

**********************************************************************************************************************************

🛠️ Technology Stack

This project has been built using the MERN-style approach (minus Mongo, with MySQL as the database):

Frontend: React.js, Tailwind CSS, Axios

Backend: Node.js, Express.js

Database: MySQL

Authentication: bcrypt.js (password hashing), jsonwebtoken (secure session management)

The combination of these technologies ensures a fast, responsive, and secure web application with efficient data handling.

****************************************************************************************************

🚀 Setup & Installation
Prerequisites

Node.js (v14 or above)

Git

MySQL Server & Workbench

Steps
# Clone the repository
git clone https://github.com/Vid876/store-ratings-app.git
cd store-ratings-app

Backend Setup
cd backend
npm install


Create a database in MySQL:

CREATE DATABASE store_ratings_db;

****************************************************************************************************
Import the provided database.sql schema.

Update database credentials inside backend/server.js.

Run the backend:

node server.js
✅ Expected Output:

Server is running on port 5001
Successfully connected to the database.
**********************************************************************************************************
Frontend Setup
cd ../my-store-ratings-app
npm install
npm start


✅ React app will run at: http://localhost:3000/

*********************************************************************************************************

🔐 Authentication & Security

Passwords are hashed using bcrypt.js before storage.

JWT tokens manage session security and role-based access.

Sensitive data (like credentials) is handled securely using environment variables.

*****************************************************************************************************

📊 Dashboards

Admin Dashboard: High-level overview of platform usage (users, stores, ratings).

User Dashboard: Explore and rate stores with search functionality.

Owner Dashboard: Access to store-specific analytics (average rating, user reviews).

************************************************************************************************************

📂 Project Structure
store-ratings-app/
│
├── backend/                # Node.js + Express backend
│   ├── server.js           # Backend entry point
│   ├── routes/             # API routes
│   ├── models/             # Database models
│   └── database.sql        # SQL schema
│
├── my-store-ratings-app/   # React frontend
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── pages/          # Pages (Login, Dashboard, etc.)
│   │   ├── services/       # API calls with Axios
│   │   └── App.js          # Main app file
│
└── README.md               # Documentation

******************************************************************************************************

🌟 Highlights

Built with scalability and modular design in mind.

Cleanly separated frontend, backend, and database layers.

Implements real-world practices: authentication, role-based access, dashboards.

Easy to set up and extend with future enhancements.


**********************************************************************************************************

🚀 Future Improvements

Deploy application on Render / Vercel / AWS.

Add pagination and advanced filtering in store listings.

Enable image upload for store profiles.

Add analytics dashboards with charts for ratings trends.




