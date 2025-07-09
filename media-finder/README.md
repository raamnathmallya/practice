
# MediaFinder

This is a web application that allows users to discover and search for movies and get download links.

## Setup and Installation

### 1. Get a TMDb API Key

This application requires an API key from The Movie Database (TMDb) to fetch movie information. You can get a free key by following these steps:

1.  Create an account on [themoviedb.org](https://www.themoviedb.org/).
2.  Go to your account settings, click on the "API" tab, and follow the instructions to request an API key.
3.  Once you have your key, open the `backend/server.js` file and replace `'YOUR_TMDB_API_KEY_HERE'` with your actual key.

### 2. Install Dependencies

You need to install the necessary `npm` packages for both the backend and frontend.

*   **For the backend:**

    ```bash
    cd backend
    npm install
    ```

*   **For the frontend:**

    ```bash
    cd ../frontend
    npm install
    ```

### 3. Run the Application

To run the application, you will need to have two terminals open.

*   **In your first terminal, start the backend server:**

    ```bash
    cd backend
    node server.js
    ```

    The backend will be running at `http://localhost:4000`.

*   **In your second terminal, start the frontend development server:**

    ```bash
    cd frontend
    npm start
    ```

    The frontend will automatically open in your browser at `http://localhost:3000`.

## How to Use

*   The application will initially display a list of recently released movies.
*   Use the search bar at the top to find a specific movie.
*   Click on any movie poster to see the available (mock) download links.
*   Clicking a "Download" link will open the magnet link in your default torrent client.
