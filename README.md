# Task Manager API (NestJS + TypeORM + PostgreSQL)

A full-featured Task Management System built with NestJS, TypeORM, and PostgreSQL, featuring:

- User Authentication (Signup, Login, Logout)
- Role-based Access Control (Admin & Normal Users)
- Task Lists and Items
- Scheduled Email Reminders for Upcoming Tasks
- Forget & Reset Password Functionality
- Session-based Authorization using Guards and Interceptors

---

## Tech Stack

| Category           | Technology                          |
| ------------------ | ----------------------------------- |
| Backend Framework  | NestJS                              |
| ORM                | TypeORM                             |
| Database           | PostgreSQL                          |
| Validation         | class-validator & class-transformer |
| Email              | @nestjs-modules/mailer              |
| Scheduling         | @nestjs/schedule                    |
| Session Management | Express Sessions with NestJS        |
| Authentication     | Custom AuthGuard with Sessions      |

---

## Setup & Installation

1. Clone the Repository

git clone https://github.com/zeyadAlbadawy/TODO_API
cd task-manager-api

2. Install Dependencies

npm install

3. Setup Environment Variables

Create a .env file in the root directory:

DB_HOST=HOST
DB_PORT=PORT
DB_PASSWORD=PASSWORD
DB_USER_NAME=USERNAME
COOKIE_SECRET=SECRET
EMAIL_HOST=HOST
EMAIL_USER=USER_MAIL
EMAIL_PASSWORD=MAIL_PASS

4. Start the Server

npm run start:dev

---

## Features Overview

### Authentication Routes (/users/auth)

| Method | Endpoint               | Description                      | Auth Required |
| ------ | ---------------------- | -------------------------------- | ------------- |
| POST   | /signup                | Register a new user              | No            |
| POST   | /login                 | Log in an existing user          | No            |
| POST   | /logout                | Log out a user                   | Yes           |
| GET    | /whoami                | Get the currently logged-in user | Yes           |
| PATCH  | /:id                   | Update user info                 | Yes           |
| POST   | /forget-password       | Request password reset token     | No            |
| PATCH  | /reset-password/:token | Reset password using token       | No            |
| GET    | /all-users             | Admin only: list all users       | Yes (Admin)   |

---

### Lists Routes (/lists)

| Method | Endpoint        | Description                    | Auth Required |
| ------ | --------------- | ------------------------------ | ------------- |
| POST   | /create-list    | Create a new list              | Yes           |
| PATCH  | /:id            | Update list title              | Yes           |
| PATCH  | /aurchieve/:id  | Archive/unarchive list         | Yes           |
| DELETE | /:id            | Delete list                    | Yes           |
| GET    | /               | Get all lists of current user  | Yes           |
| GET    | /all-lists      | Admin only: get all lists      | Yes (Admin)   |
| GET    | /:id            | Get a single list (user-owned) | Yes           |
| GET    | /list-items/:id | Get all items in a list        | Yes           |

---

### Items Routes (/items)

| Method | Endpoint      | Description              | Auth Required |
| ------ | ------------- | ------------------------ | ------------- |
| POST   | /add-item/:id | Add item to list         | Yes           |
| DELETE | /:id          | Delete item from list    | Yes           |
| POST   | /toggle/:id   | Toggle completion status | Yes           |
| PATCH  | /:id          | Update item details      | Yes           |

---

### Scheduled Jobs (ScheduleService)

A cron job runs every hour using:

@Cron(CronExpression.EVERY_HOUR)

It:

- Checks for tasks (Items) expiring within the next 60 minutes
- Sends email notifications via MailerService
- Marks overdue tasks as expired

---

## Key Components

### Guards

- AuthGuard: Ensures user is authenticated via session
- AdminGuard: Allows only Admins to access admin routes

### Interceptors

- UserInterceptor: Serializes user responses (prevents password leakage)
- CurrentUserInterceptor: Globally fetches and attaches the current user from the session

### Decorators

- @CurrentUser(): Fetches the logged-in user instance inside any controller

---

## Example Requests (with curl)

### Sign Up

curl -X POST http://localhost:3000/users/auth/signup -H "Content-Type: application/json" -d '{"firstName":"Zeyad","lastName":"Albadawy","email":"zeyad@gmail.com","password":"123456"}'

### Create List

curl -X POST http://localhost:3000/lists/create-list -H "Content-Type: application/json" --cookie "session=<your_session_id>" -d '{"title":"My Tasks"}'

### Add Item to List

curl -X POST http://localhost:3000/items/add-item/<list_id> -H "Content-Type: application/json" --cookie "session=<your_session_id>" -d '{"title":"Finish project","description":"Due soon","dueDate":"2025-10-08T12:00:00Z"}'

---

## Error Handling

The app uses NestJS HttpException classes for clear error responses:

- BadRequestException – Invalid input or UUID
- NotFoundException – Missing entities
- UnauthorizedException – User without permission

Example response:

{
"statusCode": 401,
"message": "You don't have permission to do this action",
"error": "Unauthorized"
}

---

## Email Notifications

Emails are sent using @nestjs-modules/mailer.
Configuration example:

MailerModule.forRoot({
transport: {
service: 'gmail',
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS,
},
},
});

---

## License

This project is licensed under the MIT License.
You are free to use, modify, and distribute this software.

---

## Author

Zeyad Albadawy
Email: zeyadalbadawyamm@gmail.com
Built with NestJS
