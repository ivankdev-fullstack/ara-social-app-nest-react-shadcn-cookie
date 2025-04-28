## About

NestJS & React (Vite) twitter-like application to share posts among other users;

### Technical Stack

- **NestJS:** A progressive Node.js framework for building efficient, scalable, and maintainable server-side applications with TypeScript support.

- **TypeScript:** A strongly-typed programming language that builds on JavaScript, adding static typing and enhanced development tools.

- **JWT:** A compact, URL-safe token format used for securely transmitting authentication and authorization data between parties in web applications.

- **Jest:** A JavaScript testing framework focused on simplicity, with powerful features for unit, integration, and snapshot testing.

- **React**: A JavaScript library for building user interfaces, primarily for single-page applications. It allows developers to build reusable UI components and manage the state of their application efficiently.

- **Vite**: A fast and modern build tool for web development that provides a development server and optimized bundling, leveraging ES modules and modern JavaScript features for faster build times.

- **Zod**: A TypeScript-first schema declaration and validation library that allows developers to define data structures with strict type-checking and validation, ensuring the integrity and correctness of inputs in applications.

- **Shadcn**: A library or utility for creating UI components in React that follows the principles of Tailwind CSS, enabling easy customization and rapid development of aesthetically consistent interfaces.

- **TailwindCSS** v4: A utility-first CSS framework for rapidly building custom designs without writing CSS. Version 4 introduces enhanced utility classes and further customization options for responsive, modern web design.

## Fill up the envs

For backend (.env - production, .env.dev - development):

```bash
# App
PORT=3333
NODE_ENV=development
CLIENT_URL=

# Firebase
SA_KEY=service-account.json
```

For frontend (.env):

```bash
# App
VITE_API_URL=
VITE_ENV=development

# Firebase
VITE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=

# Algoria
VITE_ALG_ID=
VITE_ALG_SEARCH_API_KEY=
```

## Run app

Install packages:

```bash
npm install
```

Run the application:

```bash
# backend
npm run start:dev
# frontend
npm run dev
```

## API Endpoints

| Route                         | Method | Description                                            | Cookie token header |
| ----------------------------- | ------ | ------------------------------------------------------ | ------------------- |
| /auth/me                      | GET    | Retrieves user profile info                            | Yes                 |
| /auth/login                   | POST   | Authenticates a user and sets a session token          | No                  |
| /auth/register                | POST   | Registers a new user and returns authentication token  | No                  |
| /posts/                       | GET    | Retrieves a list of posts                              | No                  |
| /posts/                       | POST   | Creates a new post                                     | Yes                 |
| /posts/:id                    | PUT    | Updates a specific post by its ID                      | Yes                 |
| /posts/:id                    | DELETE | Deletes a specific post by its ID                      | Yes                 |
| /reactions/toggle             | POST   | Toggles a reaction (like/dislike) for a post/comment   | Yes                 |
| /comments/by-target/:type/:id | GET    | Retrieves comments for a specified target (post, etc.) | No                  |
| /comments/                    | POST   | Creates a new comment for a specific post              | Yes                 |
| /comments/:id                 | PUT    | Updates a specific comment by its ID                   | Yes                 |
| /comments/:id                 | DELETE | Deletes a specific comment by its ID                   | Yes                 |
| /users/:id                    | GET    | Retrieves user details by their ID                     | No                  |
| /users/:id/upload-avatar      | POST   | Uploads a new avatar for the user                      | No                  |
| /users/:id                    | PUT    | Updates user details by their ID                       | Yes                 |
| /users/:id                    | DELETE | Deletes a user by their ID                             | Yes                 |
