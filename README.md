# Diary App

An application to track your days with notes for every day. It supports Google OAuth and local authentication with email verification. The Quill library was chosen for editing, providing a rich set of features to personalize your experience. Notes editing is performed using WebSockets, allowing you to receive instant updates across all devices connected to your account.

## Technical Notes

- **Node Version**: v22.14.0 (npm v10.9.2)

## Start application for development

### Client

1.  Navigate to the client directory:

    ```bash
    cd client
    ```

2.  Start the client in development mode:

    ```bash
    npm run dev
    ```

### Server

1.  Navigate to the server directory:

    ```bash
    cd server
    ```

2.  Start the client in development mode:

    ```bash
    npm run start:dev
    ```

### Important

If the server doesn't start, it's probably because the of the command `start:dev` inside the `package.json`. Replace it inside `package.json` with this command: `start:dev": "nest start --watch` and run the command `docker compose up -f docker-compose.dev.yaml up -d` inside the `server` folder manually.
