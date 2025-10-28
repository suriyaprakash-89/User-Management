# Fluxion Systems - User Management Platform

This project is my submission for the Fluxion Systems internship assessment. It's a full-stack application built with React, Node.js, and PostgreSQL that allows for importing, managing, and searching user data from an Excel file.

### Core Features

-   **Excel Data Import:** Seamlessly upload `.xlsx` files with user data.
-   **Duplicate Handling:** Prevents duplicate entries based on email or contact number.
-   **Dynamic Data Grid:** A clean, responsive card grid for displaying users.
-   **Advanced Search & Sort:** Full-text search and filtering, with options to sort the results.
-   **Pagination:** Handles large datasets efficiently with server-side pagination.
-   **Saved Searches:** Save and re-apply common filter combinations.
-   **Export to CSV:** Export the currently filtered view to a `.csv` file.

### Tech Stack

-   **Backend:** Node.js, Express, PostgreSQL
-   **Frontend:** React (Vite), TailwindCSS, Framer Motion
-   **Database:** PostgreSQL

### Project Structure

The project is split into two main folders:

-   `/backend`: The Node.js/Express server that handles all API logic and database interaction.
-   `/frontend`: The React client application that provides the user interface.

Each folder has its own `package.json` and requires its own dependencies to be installed.

---

### How to Run Locally

#### Prerequisites

-   Node.js (v18 or later recommended)
-   npm
-   PostgreSQL must be installed and running.

#### 1. Database Setup

First, you need to create the database and the required tables.

1.  Make sure your PostgreSQL server is running. Create the database by running this command in your terminal:
    ```bash
    createdb -U postgres fluxion_assessment
    ```
    *(You will be prompted for your Postgres user password.)*

2.  Navigate to the `backend` directory and run the schema script to create the tables.
    ```bash
    cd backend
    psql -U postgres -d fluxion_assessment -f db_schema.sql
    ```

#### 2. Backend Setup

1.  In the `/backend` directory, create a `.env` file and add your database credentials.

    ```env
    # .env file for the backend
    DB_USER=postgres
    DB_HOST=localhost
    DB_DATABASE=fluxion_assessment
    DB_PASSWORD=your_postgres_password
    DB_PORT=5432
    PORT=5000
    ```

2.  Install dependencies and start the server.
    ```bash
    npm install
    npm run dev
    ```
    The backend API will now be running on `http://localhost:5000`.

#### 3. Frontend Setup

1.  Open a **new terminal window** and navigate to the `/frontend` directory.

2.  Install dependencies and start the client.
    ```bash
    cd ../frontend 
    # Or navigate directly to the /frontend folder
    
    npm install
    npm run dev
    ```
    The application will open in your browser, usually at `http://localhost:5173`.

---

### Notes & Future Improvements

I really enjoyed building this project and went beyond the core requirements to add features like pagination, sorting, and CSV export to make it feel like a more complete, real-world application.

If I had more time, here are a few things I'd consider adding:

-   **User Authentication:** Adding a login system (e.g., with JWT) to secure the platform.
-   **In-line Editing:** Allowing an admin to click on a user card to edit details directly in the UI.
-   **More Robust Validation:** Using a schema validation library like Zod on the backend for more detailed error messages on upload.