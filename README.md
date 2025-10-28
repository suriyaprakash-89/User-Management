# Fluxion Systems - User Management Platform

This project is my submission for the Fluxion Systems internship assessment. It's a full-stack application built with React, Node.js, and PostgreSQL that allows for importing, managing, and searching user data from an Excel file.

## 🧩 Version

v1.0.0 — October 2025

### Core Features

- **Excel Data Import:** Seamlessly upload `.xlsx` files with user data.
- **Duplicate Handling:** Prevents duplicate entries based on email or contact number.
- **Dynamic Data Grid:** A clean, responsive card grid for displaying users.
- **Advanced Search & Sort:** Full-text search and filtering, with options to sort the results.
- **Pagination:** Handles large datasets efficiently with server-side pagination.
- **Saved Searches:** Save and re-apply common filter combinations.
- **Export to CSV:** Export the currently filtered view to a `.csv` file.

### Tech Stack

- **Backend:** Node.js, Express, PostgreSQL
- **Frontend:** React (Vite), TailwindCSS, Framer Motion
- **Database:** PostgreSQL

---

## 📁 Folder Structure

Here’s the project layout based on the actual implementation:

```
FSYS_TASKS/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── searchController.js
│   │   └── userController.js
│   ├── routes/
│   │   ├── searches.js
│   │   └── users.js
│   ├── sample_files/
│   │   ├── user_data.xlsx
│   │   └── users_2.xlsx
│   ├── services/
│   │   └── userService.js
│   ├── .env
│   ├── .gitignore
│   ├── db_schema.sql
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   ├── favicon.png
    │   └── FSYS_logo.png
    ├── src/
    │   ├── api/
    │   │   └── index.js
    │   ├── components/
    │   │   ├── views/
    │   │   │   ├── ManageUsersView.jsx
    │   │   │   ├── UploadView.jsx
    │   │   │   ├── Pagination.jsx
    │   │   │   ├── SavedSearches.jsx
    │   │   │   ├── SearchBar.jsx
    │   │   │   └── UserGrid.jsx
    │   │   └── pages/
    │   │       └── DashboardPage.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .env
    ├── .gitignore
    ├── index.html
    ├── package.json
    └── package-lock.json
```

---

## 🌐 API Endpoints Overview

| Method     | Endpoint                  | Description                                                |
| :--------- | :------------------------ | :--------------------------------------------------------- |
| **POST**   | `/api/upload`             | Upload an Excel file and import users                      |
| **GET**    | `/api/users`              | Fetch all users with filters (name, age, gender, location) |
| **POST**   | `/api/saved-searches`     | Save a new filter/search combination                       |
| **GET**    | `/api/saved-searches`     | Retrieve saved searches                                    |
| **DELETE** | `/api/saved-searches/:id` | Delete a saved search                                      |

---

## 📄 Sample Excel Format

The Excel file you upload should have the following headers (case-insensitive):

| Name          | Email                                                 | Contact Number | Age | Gender | Location    |
| ------------- | ----------------------------------------------------- | -------------- | --- | ------ | ----------- |
| Alice Johnson | [alice.j@example.com](mailto:alice.j@example.com)     | 9876543210     | 28  | Female | New York    |
| Bob Williams  | [bob.w@example.com](mailto:bob.w@example.com)         | 9876543211     | 34  | Male   | Los Angeles |
| Charlie Brown | [charlie.b@example.com](mailto:charlie.b@example.com) | 9876543212     | 45  | Male   | Chicago     |
| Diana Miller  | [diana.m@example.com](mailto:diana.m@example.com)     | 9876543213     | 22  | Female | Houston     |

> **Tip:** You can also use the provided sample files in `backend/sample_files/` for quick testing.

---

## 📦 Quick Start

````bash
git clone <your-repo-url>
cd FSYS_TASKS
cd backend && npm install
cd ../frontend && npm install

### How to Run Locally

#### Prerequisites

* Node.js (v18 or later recommended)
* npm
* PostgreSQL must be installed and running.

#### 1. Database Setup

1. Make sure your PostgreSQL server is running. Create the database by running this command in your terminal:

   ```bash
   createdb -U postgres fluxion_assessment
````

2. Navigate to the `backend` directory and run the schema script to create the tables:

   ```bash
   cd backend
   psql -U postgres -d fluxion_assessment -f db_schema.sql
   ```

#### 2. Backend Setup

1. In the `/backend` directory, create a `.env` file and add your database credentials:

   ```env
   DB_USER=postgres
   DB_HOST=localhost
   DB_DATABASE=fluxion_assessment
   DB_PASSWORD=your_postgres_password
   DB_PORT=5432
   PORT=5000
   ```

2. Install dependencies and start the server:

   ```bash
   npm install
   npm run dev
   ```

   The backend API will now be running on `http://localhost:5000`.

#### 3. Frontend Setup

1. Open a new terminal and navigate to the `/frontend` directory.
2. Install dependencies and start the client:

   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

   The application will open in your browser at `http://localhost:5173`.

---

## ⚙️ Environment Variables Summary

| Variable      | Description         | Example              |
| ------------- | ------------------- | -------------------- |
| `DB_USER`     | PostgreSQL username | `postgres`           |
| `DB_PASSWORD` | PostgreSQL password | `your_password`      |
| `DB_HOST`     | Database host       | `localhost`          |
| `DB_PORT`     | PostgreSQL port     | `5432`               |
| `DB_DATABASE` | Database name       | `fluxion_assessment` |
| `PORT`        | Backend server port | `5000`               |

---

## Notes & Future Improvements

I really enjoyed building this project and went beyond the core requirements to add features like pagination, sorting, and CSV export to make it feel like a more complete, real-world application.

If I had more time, here are a few things I'd consider adding:

- **User Authentication:** Adding a login system (e.g., with JWT) to secure the platform.
- **In-line Editing:** Allowing an admin to click on a user card to edit details directly in the UI.
- **More Robust Validation:** Using a schema validation library like Zod on the backend for more detailed error messages on upload.

---

## 👨‍💻 Author

**Suriya Prakash R**
📧 Email: suriyaprakash3036@gmail.com
🔗 LinkedIn: https://www.linkedin.com/in/suriya-prakash30/
🗓️ Project Type: Internship Assessment – Fluxion Systems Technologies Pvt. Ltd.

---
