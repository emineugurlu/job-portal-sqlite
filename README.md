# 💼 ConnectHub: Full-Stack Recruitment Ecosystem

> **"A robust Job-Board application featuring secure JWT authentication, relational data modeling with Sequelize, and a dynamic React-driven administrative interface."**

![Repo Size](https://img.shields.io/github/repo-size/emineugurlu/job-portal?color=green&style=flat-square)
![Stack](https://img.shields.io/badge/Stack-PERN--ish-blue?style=flat-square)
![Auth](https://img.shields.io/badge/Auth-JWT-orange?style=flat-square)

Modern recruitment requires seamless data flow. This project is a technical implementation of a **Role-Based Access Control (RBAC)** system. By integrating a Node.js Express backend with a Sequelize ORM layer, I created a secure environment where data integrity is maintained across User and Admin roles. The application handles complex tasks such as file stream management for CV uploads and stateful job filtering.

---

## 🚀 Engineering Mindset

This application focuses on **Scalable Backend Logic & State Management**:

*   **Relational Data Modeling:** Architecting User, JobPosting, and Category models using **Sequelize ORM** to ensure strictly typed database interactions and automated migrations.
*   **RBAC Authentication Middleware:** Implementing a custom JWT-based authentication layer that validates user sessions and enforces permission boundaries between Users and Admins.
*   **Binary Data Handling:** Utilizing **Multer** for multipart/form-data processing, enabling secure file uploads for professional CVs and job attachments.
*   **Declarative UI Orchestration:** Building a React frontend with **Vite** that utilizes custom hooks for data fetching and **Framer Motion** for hardware-accelerated UI transitions.
*   **RESTful API Design:** Developing a structured API surface for CRUD operations, ensuring clean separation of concerns between the view layer and the data layer.

## 🌟 Key Features

*   **Dual-Role Ecosystem:** Distinct workflows for Job Seekers (Profile/CV Management) and Admins (Content Governance).
*   **Dynamic Content Management:** Real-time creation, editing, and deletion of job postings and categories.
*   **Advanced Filtering:** Interactive job search interface with category-based filtering logic.
*   **Cinematic Hero Section:** Smooth, motion-driven entry animations powered by Framer Motion.

## 🔧 Technical Stack

*   **Backend:** Node.js, Express, Sequelize (SQLite/PostgreSQL ready).
*   **Frontend:** React (Vite), Framer Motion, CSS-in-JS.
*   **Security:** JWT (JSON Web Tokens), BCrypt for password hashing.
*   **Storage:** Multer for local/cloud file stream management.

## 📸 Visual Showcase

![Discovery View 1](https://github.com/user-attachments/assets/40bd4ce3-ce0c-4af6-944d-edb04a04b3b1)
![Discovery View 2](https://github.com/user-attachments/assets/f9f47a12-5ee2-4302-bd12-c3693eb22cf9)
![Admin Panel](https://github.com/user-attachments/assets/207477c2-207477c2-207477c2)
![Profile View](https://github.com/user-attachments/assets/9c9c6ff8-a423-4baa-ae1e-0bb87c9ddd9d)

---

## 🛠️ Installation & Quick Start

1. **Clone & Setup Backend:**
   ```bash
   git clone [https://github.com/emineugurlu/job-portal.git](https://github.com/emineugurlu/job-portal.git)
   cd job-portal/backend
   npm install
   npm start

2. **Setup Frontend:**
````bash
   cd ../frontend
   npm install
   npm run dev
````
Developed by Emine Uğurlu - Computer Engineer.
