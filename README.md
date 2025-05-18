# JobPortal

A simple job-posting web application with user & admin roles, built with:

- **Backend**: Node.js, Express, Sequelize (SQLite)
- **Frontend**: React (Vite)
- **Authentication**: JWT
- **File uploads**: Multer (job attachments + user CVs)
- **Styling**: CSS-in-JS and custom CSS files
- **Animations**: Framer Motion (Hero section)

---

## 🚀 Quick Start

1. **Clone**

   ```bash
   git clone https://github.com/your-username/job-portal.git
   cd job-portal
cd backend
npm install
JWT_SECRET=your_super_secret_key
npm start
cd ../frontend
npm install
npm run dev
VITE_API_BASE_URL=http://localhost:5000
root
├── backend/
│   ├── db.js              # Sequelize setup
│   ├── index.js           # Express app & routes
│   ├── middleware/auth.js # JWT authentication
│   ├── models/            # Sequelize models (User, JobPosting, Category)
│   └── uploads/           # Uploaded files (jobs + cvs)
└── frontend/
    ├── public/            # Static assets: logo.png, hero-bg.jpg
    ├── src/
    │   ├── App.jsx        # Main React entry
    │   ├── Layout.jsx     # Navbar + page wrapper
    │   ├── Hero.jsx/.css  # Hero banner
    │   ├── Login.jsx      # Styled login form
    │   ├── Register.jsx   # Styled registration form
    │   ├── Jobs.jsx       # Job listing + filters
    │   ├── JobForm.jsx    # Create new job form (admin only)
    │   ├── JobEdit.jsx    # Edit job form (admin only)
    │   ├── Category.jsx   # Category management (admin only)
    │   └── Profile.jsx    # User profile + CV upload
    └── vite.config.js
🔐 Roles
User:

Can register & login

Can view job listings

Can update own profile & upload CV

Admin:

Same as user, plus:

Create / update / delete job postings

Manage categories
To make someone an admin, either:

Sign up normally, then manually edit their role to admin in the SQLite DB; or

Use the provided /scripts/seed-admin.js to bootstrap an admin user.
![image](https://github.com/user-attachments/assets/40bd4ce3-ce0c-4af6-944d-edb04a04b3b1)
![image](https://github.com/user-attachments/assets/f9f47a12-5ee2-4302-bd12-c3693eb22cf9)
![image](https://github.com/user-attachments/assets/207477c2-d16e-40b9-bb86-168544105a4b)
![image](https://github.com/user-attachments/assets/9c9c6ff8-a423-4baa-ae1e-0bb87c9ddd9d)
![image](https://github.com/user-attachments/assets/c25295a8-38a0-4110-b1e7-b2918b48084a)


🤝 Contributing
Fork & clone

Create a feature branch

Commit & push

Open a pull request

