# Workshop Job Tracker System

A comprehensive job tracking system for automotive repair workshops, developed using modern web technologies with separate backend and frontend applications.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Employee Registration](#employee-registration)
- [Authentication & Authorization](#authentication--authorization)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Project Overview

The Workshop Job Tracker System streamlines management of repair jobs for automotive workshops. It provides tools for managing customers, vehicles, mechanics, and job assignments through an interactive React-based frontend and a robust backend API.

---

## Project Structure

- `backend/` - Backend REST API server (Laravel/PHP)
- `frontend2/` - Frontend single-page application (React + Tailwind CSS)

---

## Technologies Used

- **Backend:** Laravel (PHP), MySQL, REST API
- **Frontend:** React.js, React Router, Tailwind CSS, SweetAlert2
- **Others:** Axios for API communication, Vite for frontend build

---

## Setup and Installation

### Prerequisites

- PHP >= 8.x, Composer
- Node.js >= 16.x, npm or yarn
- MySQL Server

### Backend Setup

1. Navigate to the `backend/` directory.
2. Run `composer install` to install PHP dependencies.
3. Copy `.env.example` to `.env` and configure your database credentials.
4. Run migrations and seeders:
   ```bash
   php artisan migrate --seed
   ```
5. Start the backend server:
   ```bash
   php artisan serve
   ```
   The API will be available at `http://localhost:8000/api`.

### Frontend Setup

1. Navigate to the `frontend2/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Ensure the frontend is configured to communicate with backend API at `http://localhost:8000/api`.

---

## Usage

- Register customers, vehicles, and mechanics via the admin panel.
- Create and track repair jobs with assigned mechanics.
- View and update job progress and statuses.
- Authentication is required for admin users to access protected routes.

---

## API Endpoints

The backend exposes RESTful endpoints under `/api` for:

- **Customers**: Manage customer records.
- **Vehicles**: Register and update vehicles.
- **Users**: Supports role-based access (Admin `role_id = 1`, Mechanic `role_id = 2`).
- **Repair Jobs**: Create, assign, and track jobs.

For full details, refer to the backend code or API documentation.

---

## Employee Registration

A role-based employee registration system allows you to:

- Register new employees as **Admins** (`role_id = 1`) or **Mechanics** (`role_id = 2`).
- Select the employee's role from a dropdown in the registration form.
- Provide necessary user details: name, email, username, and password.
- Passwords are securely handled on the backend.

This improves user management and access control in the system.

---

## Authentication & Authorization

- **Authentication**: Admin users must log in to access the admin panel and protected API routes.
- **Authorization**: Access to features is determined by user roles (Admin or Mechanic).
- **Security**: Passwords are hashed and user sessions are managed securely.

---

## Contributing

Contributions are welcome! Please fork the repository and submit PRs for bug fixes, features, or improvements.

---

## License

This project is licensed under the MIT License.

---

## Contact

Developed by Iresh Nimantha.

GitHub: [https://github.com/Iresh-Nimantha/Workshop-Job-Tracker-System](https://github.com/Iresh-Nimantha/Workshop-Job-Tracker-System)

---

*This README provides installation, usage, and development guidance for the Workshop Job Tracker System.*
