# Calpal

Web application for user's to create and manage projects, tasks, and notes. Calpal is your go-to for improving productiving in the workplace, school, and life.

## Application Overview

### Account UI

Vue application for account creation, logging in, and account customisation.

- Javascript
- VueJs
- Vite
- Tailwindcss

### Account API

Go application for managing user authentication (JWT) and account information.

- Golang
- Postgres (Account Information)
- Google Cloud Storage (Account Images)
- Redis (JWT Refresh Token's)

### Project UI

React application for managing and viewing user's projects, tasks, and notes.

- Typescript
- React
- NextJS
- Tailwindcss

### Project API

Express application for CRUD operations, enabling users to manage their projects, tasks, etc.

- Typescript
- Express
- Postgres (Project/Task Information)
- TypeOrm
- Google PubSub (Ensuring data is synchronised across services)

### Deployment

- Docker
- Traefik (Reverse Proxy for service routing)

## Screenshots

### Fullscreen View

![Desktop UI](https://media.discordapp.net/attachments/471231303317192735/874541539563569172/unknown.png)

### Mobile View

![Mobile UI - Main View](https://media.discordapp.net/attachments/471231303317192735/874547069854056478/unknown.png)    ![Mobile UI - Menu View](https://media.discordapp.net/attachments/471231303317192735/874547125931892857/unknown.png)
