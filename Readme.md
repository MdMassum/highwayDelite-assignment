# HighwayDelite Assignment (Reactjs + TS + Express + Mongodb + Redis)

## Project Overview

This project is a robust fullstack app made using MERN stack along with redis for otp storage.Nodemailer is used to send otp to the respective user mail id. It contains CRUD operation for notes and has made keeping scalability in mind.

## Key Technologies Used

- **Node.js**: The runtime environment on which the backend is built.
- **Expressjs**: Used to handle HTTP requests and routing.
- **Mongodb**: The database used for storing user and notes data.
- **Redis**: Provides otp storage for validation along with encryption.
- **JWT**: Used for user authentication via access tokens.
- **Tailwind CSS**: Used for styling web pages.

## Project Setup On Local

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/MdMassum/highwayDelite-assignment.git 
cd  highwayDelite-assignment
```

### 2. Create .env File
Create a .env file in the root directory of backend folder and paste the following content:

```plaintext

MONGODB_URI = <Your_Mongodb_Uri>
PORT = 3000
FRONTEND_URL = <Your_Frontend_Url> // for handling cors

REDIS_URL=<Your_Redis_Url>

JWT_SECRET = <Your_Secret_Key>
JWT_EXPIRE = 1d
COOKIE_EXPIRE = 1

SMPT_SERVICE = gmail
EmailId = <Your_Email_id>
Email_Password = <Your_Email_App_Password>


```

### 3. Go to Backend Folder and Run

    cd backend && npm run dev

    This will start the backend service on http://localhost:3000


### 4. Go to Frontend Folder and Run

    cd frontend && npm run dev

    Your Frontend app will be accessible at http://localhost:5173

## APIs Overview

The API supports CRUD operations for **notes** and **user authentication**, with capabilities like creating, updating, deleting notes, and authenticating users. The API ensures seamless user experience with features such as:

- **User Authentication**: Register, login, logout. (otp based)
- **Notes Management**: Create, retrieve, update, and delete notes with pagination.
- **Error Handling**: Structured error responses with appropriate HTTP status codes for common errors like authentication failure and resource not found.


## Backend Structure

Below is the folder structure of the project:

```plaintext

├── backend
    ├── src
    │   ├── config
    │   │   ├── mongoConfig.ts
    │   │   └── redis.config.ts
    │   ├── controllers
    │   │   ├── auth.controller.ts
    │   │   └── note.controller.ts
    │   ├── middleware
    │   │   ├── auth.ts
    │   │   └── error.ts
    │   ├── models
    │   │   ├── notes.model.ts
    │   │   └── user.model.ts
    │   ├── routes
    │   │   ├── auth.route.ts
    │   │   └── notes.route.ts
    │   ├── server.ts
    │   ├── types
    │   │   └── express.d.ts
    │   ├── utils
    │   │   ├── auth.ts
    │   │   ├── errorHandler.ts
    │   │   └── sendMail.ts
    │   └── validators
    │   │   ├── auth.schema.ts
    │   │   └── note.schema.ts
    ├── tsconfig.json
    └── vercel.json
    ├── package-lock.json
    ├── package.json

```

## Frontend Structure

Below is the Frontend folder structure of the project:

```plaintext

└── frontend
    ├── public
        └── vite.svg
    ├── src
        ├── assets
        │   ├── bgImg.jpg
        │   ├── icon.png
        │   └── react.svg
        ├── components
        │   ├── Button.tsx
        │   ├── Input.tsx
        │   ├── NoteCard.tsx
        │   ├── NoteModal.tsx
        │   └── PrivateRoute.tsx
        ├── context
        │   └── ToasterContext.tsx
        ├── pages
        │   ├── Home
        │   │   └── Home.tsx
        │   ├── Login
        │   │   └── Login.tsx
        │   ├── NotFound
        │   │   └── NotFoundPage.tsx
        │   └── Signup
        │   │   └── Signup.tsx
        ├── redux
        │   ├── authSlice
        │   │   └── index.ts
        │   └── store.ts
        └── vite-env.d.ts
        ├── App.tsx
        ├── index.css
        ├── main.tsx
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vercel.json
    └── vite.config.ts
    ├── .gitignore
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
```

## API Endpoints Documentation

`http://localhost:3000/api/v1` - for local development
`https://highway-delite-assignment-backend.vercel.app/api/v1`  - for deployed link

### Auth Routes

Base URL: `/auth`

| Method | Endpoint                | Description                    |
|--------|-------------------------|--------------------------------|
| POST   | `/request-otp/signup`   | get otp for signup             |
| POST   | `/request-otp/login`    | get otp for login              |
| POST   | `/verify-otp/signup`    | verify otp and signup          |
| POST   | `/verify-otp/login`     | verify otp and login           |
| POST   | `/logout`               | logout the user                |
| GET    | `/me`                   | get profile                    |

---

### Notes Routes

Base URL: `/notes`  (All this routes are authenticated)

| Method | Endpoint           | Description                    |
|--------|--------------------|--------------------------------|
| POST   | `/new`             | create new note                |
| GET    | `/`                | Get user notes                 |
| GET    | `/:id`             | Get single note by Id          |
| PUT    | `/:id`             | Update Note by id              |
| DELETE | `/:id`             | Delete Note By id              |

---

### Frontend Deployed Link - `https://highway-delite-assignment.vercel.app/`
### Backend Deployed Link - `https://highway-delite-assignment-backend.vercel.app/`
### Postman Link - `https://www.postman.com/assignment-7873/highway-delite/collection/0hh7y53/notes?action=share&creator=35181588`

---