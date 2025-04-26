# RBAC-Node-Express-React

# 🖥️ Blog App (Admin + User Portal)

A full-stack blogging application with authentication, admin portal, email verification for new users, and more.

---

## 🚀 Getting Started

Follow the instructions below to set up and run the project locally.

---

### 1. Clone the Repository

```bash
git clone https://github.com/tnkrishnank/RBAC-Node-Express-React.git
cd RBAC-Node-Express-React
```

- This will start the backend at [http://localhost:5000/](http://localhost:5000/).

---

### 2. Start the Backend

```bash
cd backend
npm install express jsonwebtoken bcryptjs mongoose dotenv nodemailer cors
node server.js
```

- **Important:**  
  For easier setup, the `.env` file is already configured with the database (MongoDB) credentials and email credentials (for nodemailer) so that you don't need to manually configure them.  
  You can find `.env` inside the `backend/` directory.

---

### 3. Start the Frontend

```bash
cd frontend
npm install axios react-router-dom@6
npm start
```

- This will start the frontend at [http://localhost:3000/](http://localhost:3000/).

---

## 🛠️ Features

- **User Signup & Login** (with email verification)
- **Admin Portal** to create, delete, update and view all blogs (secured route)
- **Create, Read Blogs** for users to view all blogs
- **JWT Authentication** for secured APIs
- **Protected Routes** based on user roles
- **Email Verification** using nodemailer
- **Logout** functionality
- **Role-Based Access** (Admin vs User)
- **Simple Responsive Frontend**

---

## 🔥 Portal Access

| Role         | Link                                         | Access Info                                          |
| ------------ | -------------------------------------------- | --------------------------------------------------- |
| **Admin**    | [http://localhost:3000/admin](http://localhost:3000/admin) | Username: `admin`<br>Password: `admin123` |
| **User**     | [http://localhost:3000/](http://localhost:3000/)           | Create a new account using the signup page.<br>An email will be sent for verification.|

---

# 🎯 That's it — a simple full-stack Blog App is ready!