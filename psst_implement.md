Of course. This is an excellent idea for an application, and breaking it down into a detailed, phased plan is the right approach. Here is a comprehensive set of prompts and a project plan designed to guide Gemini AI in building the "Psst.." application from a prototype to a deployable product.

This plan is structured to be executed sequentially. We will start with the master prompt that outlines the entire project, and then use the specialized prompts for UI/UX and Backend development at the appropriate stages.

---

### **Master Prompt: The "Psst.." Project Implementation Plan**

**Goal:** To guide Gemini AI, acting as a senior full-stack developer, through the phased development of a prototype for the "Psst.." Android application.

**Prompt:**

"You are a senior full-stack developer tasked with building a prototype for a new map-based social event application called 'Psst..'. Your goal is to create a functional Android application prototype based on the project brief found in `psst.md`. We will develop this project in distinct phases, focusing on one major area of functionality each day.

**Our Technology Stack:**
*   **Mobile App:** Android (Kotlin) with Jetpack Compose for UI, ViewModel for state management, Retrofit for networking, and the Google Maps SDK.
*   **Backend:** Python with FastAPI for the API, running in a Docker container.
*   **Database:** PostgreSQL with the PostGIS extension for efficient location-based queries.
*   **Authentication & Chat:** Firebase (Authentication for Google Sign-In, Firestore for real-time chat).
*   **Deployment:** Google Cloud Run for the backend, Google Play Store for the Android App.

You must adhere to the following development process:
1.  **Log Everything:** For each step, explain what you are doing and why. Create log files (`/logs/day_X.log`) to document progress, decisions, and any issues encountered.
2.  **Version Control:** After completing each day's phase and verifying its functionality, you will stage all changes and write a clear, descriptive Git commit message.
3.  **Checkpoints:** Each phase is a checkpoint. We must ensure the goals of the phase are met before proceeding to the next.

Here is the day-by-day plan. Begin with Phase 1.

---

### **Phase 1: Project Foundation & Backend Setup (Day 1-2)**

**Goal:** Establish the project structure, version control, and a basic, containerized backend with database and authentication foundations.

*   **Day 1: Project Scaffolding & Backend Initialization**
    1.  Initialize a Git repository in the project root.
    2.  Create the directory structure: `/android`, `/backend`, `/logs`.
    3.  Inside `/backend`, set up a new FastAPI project:
        *   Create `main.py` with a simple `/` endpoint that returns `{"message": "Psst.. Backend is running!"}`.
        *   Create `models.py` to define the SQLAlchemy database models for `Users`, `Events`, and `Interests`.
        *   Create `database.py` to handle database connection logic.
        *   Create a `requirements.txt` file listing `fastapi`, `uvicorn`, `sqlalchemy`, `psycopg2-binary`, and `geoalchemy2`.
    4.  Create a `Dockerfile` in the `/backend` directory to containerize the FastAPI application.
    5.  Create a `docker-compose.yml` file to run the FastAPI app and a PostgreSQL database with the PostGIS extension.
    6.  **Checkpoint:** Build and run the containers. Verify you can access the `http://localhost:8000/` endpoint.
    7.  **Commit:** Create a commit with the message: `feat(backend): initialize FastAPI project structure and Docker setup`.

*   **Day 2: Authentication & User Endpoints**
    1.  Set up a new project in the Firebase console. Enable Google Authentication and Firestore.
    2.  In the backend, integrate the Firebase Admin SDK.
    3.  Create a new `/auth` router.
    4.  Implement a `/auth/google` endpoint. This endpoint will receive a Google ID token from the Android client, verify it using the Firebase Admin SDK, and then either retrieve the existing user from the database or create a new one. It should return a JWT or session token for our API.
    5.  **Checkpoint:** Manually test the endpoint using a valid Google ID token. Verify that users are correctly created in the PostgreSQL database.
    6.  **Commit:** Create a commit with the message: `feat(auth): implement Google Sign-In verification and user creation`.

---

### **Phase 2: Core Application Logic (Day 3-4)**

**Goal:** Implement the core business logic for creating and viewing events.

*   **Day 3: Event Creation (CRUD)**
    1.  Implement the full CRUD (Create, Read, Update, Delete) API endpoints for events under an `/events` router.
    2.  The `POST /events` endpoint should take a title, description, start time, and a location (latitude, longitude). Use GeoAlchemy2 to store the location as a `POINT` type in PostGIS.
    3.  The endpoint must be protected, requiring a valid authentication token.
    4.  **Checkpoint:** Test all CRUD endpoints using an API client like Postman or Insomnia. Ensure location data is being saved correctly.
    5.  **Commit:** `feat(events): implement CRUD API endpoints for events`.

*   **Day 4: The Event Feed**
    1.  Implement the main feed endpoint: `GET /feed`.
    2.  This endpoint must accept the user's current latitude and longitude as query parameters.
    3.  Use PostGIS's `ST_DWithin` function to find all events within a certain radius (e.g., 25km) of the user's location.
    4.  Implement basic pagination (e.g., `?page=1&limit=20`).
    5.  **Checkpoint:** Populate the database with several test events at different locations. Call the `/feed` endpoint with various coordinates to ensure the correct events are returned.
    6.  **Commit:** `feat(feed): implement location-based event feed with PostGIS`.

---

### **Phase 3: Android UI/UX Implementation (Day 5-7)**

**Goal:** Build the static UI screens for the Android app using Jetpack Compose.

*   **Day 5: Project Setup & Onboarding Screens**
    1.  Create a new Android Studio project in the `/android` directory.
    2.  Add all necessary dependencies to `build.gradle.kts` (Compose, ViewModel, Navigation, Retrofit, Google Sign-In, Maps SDK).
    3.  **Execute UI/UX Prompt:** Use the detailed "UI/UX Prompt for Psst.." (provided below) to generate the visual designs and theme.
    4.  Implement the Login screen with a "Sign in with Google" button.
    5.  Implement the Interest Selection screen for first-time users.
    6.  **Checkpoint:** The onboarding flow UI is complete and navigable, but without logic.
    7.  **Commit:** `feat(android): set up project and implement static onboarding UI`.

*   **Day 6: Main Screens UI**
    1.  Implement the main app shell with a Bottom Navigation Bar (Feed, Map, Create, Chat, Profile).
    2.  Create the static UI for the Home Feed, which will show a list of event cards.
    3.  Create the static UI for the "Create Event" form.
    4.  **Checkpoint:** The main screens are visually complete and look according to the UI/UX design.
    5.  **Commit:** `feat(android): implement static UI for Home Feed and Create Event screens`.

*   **Day 7: Connecting the Dots**
    1.  Set up Retrofit and the Google Sign-In client.
    2.  Implement the logic for the "Sign in with Google" button. On success, send the token to your backend's `/auth/google` endpoint. Securely store the returned API token.
    3.  Connect the Home Feed to the `GET /feed` endpoint. Use the phone's location services to get coordinates and display the events returned by the API.
    4.  **Checkpoint:** The user can log in. The home feed successfully displays events from the backend based on the user's location.
    5.  **Commit:** `feat(android): integrate Google Sign-In and connect feed to backend API`.

---

### **Phase 4: Prototype Completion & Play Store Prep (Day 8-10)**

**Goal:** Finalize the prototype, prepare for deployment, and ensure it's installable.

*   **Day 8: Map View & Event Creation**
    1.  Integrate the Google Maps SDK into the Map screen. Fetch events from the backend and display them as markers.
    2.  Implement the logic for the "Create Event" screen to `POST` the data to the `/events` endpoint.
    3.  **Checkpoint:** Users can view events on a map and successfully create a new event that appears in the feed and on the map for other users.
    4.  **Commit:** `feat(android): implement map view and fully functional event creation`.

*   **Day 9: Final Polish & Chat MVP**
    1.  Implement the basic real-time chat using Firebase Firestore. Create a simple UI for a list of conversations and a chat screen.
    2.  Refine the UI, add loading indicators, and handle error states gracefully (e.g., no network).
    3.  **Checkpoint:** The core features (Feed, Map, Create Event, Chat MVP) are working. The app feels responsive.
    4.  **Commit:** `refactor(app): add chat MVP and polish UI/UX`.

*   **Day 10: Build & Deploy**
    1.  Prepare the app for release. Create an app icon, generate a signed Android App Bundle (AAB).
    2.  Write a `Privacy Policy` and `Terms of Service` (can be simple placeholders for a prototype) and host them.
    3.  Deploy the backend Docker container to Google Cloud Run.
    4.  **Checkpoint:** You have a signed AAB file and a live backend URL. The app, when installed on a physical device, successfully communicates with the live backend.
    5.  **Commit:** `chore(release): prepare app for deployment and generate signed AAB`.

---
---

### **UI/UX Prompt for Psst..**

**Goal:** To generate a modern, intuitive, and visually appealing design system for the app.

**Prompt:**

"You are a senior UI/UX designer. Your task is to create a complete design system and high-fidelity mockups for an Android application called 'Psst..'.

**Core Principles:**
*   **Modern & Clean:** Use ample white space. The interface should feel uncluttered and focused.
*   **Intuitive:** The user flow must be natural and predictable.
*   **Vibrant & Energetic:** The app is about events, so the color scheme should be engaging but not overwhelming.

**Design System:**
1.  **Color Palette:** Propose a primary color (e.g., a vibrant purple or teal), a secondary accent color, and standard colors for success, error, and warnings.
2.  **Typography:** Select a clean, readable sans-serif font pairing from Google Fonts (e.g., Poppins for headers, Lato for body). Define sizes and weights for H1, H2, Body, Caption, etc.
3.  **Iconography:** Use the Material Design Icons library. Keep the style consistent (e.g., Filled or Outlined).
4.  **Component Library:** Design the following reusable Jetpack Compose components:
    *   **Event Card:** This is the most important component. It should display a cover photo, event title, date/time, distance from the user (e.g., "5.2 km away"), and icons for RSVP counts.
    *   **Buttons:** Primary, secondary, and tertiary button styles, including a Google Sign-In button.
    *   **Input Fields:** Standard text fields, password fields, and a larger text area for descriptions.
    *   **Bottom Navigation Bar:** Design the icons and active/inactive states.

**Screen Mockups:**
Please provide high-fidelity mockups for the following screens:
1.  **Onboarding:** Login Screen, Interest Selection (a grid of selectable interest chips).
2.  **Main Feed:** A vertical, scrollable list of Event Cards.
3.  **Event Detail:** A screen showing all event details, a larger map view of the location, a prominent RSVP button, and a comments section.
4.  **Create Event Form:** A clean form for all the required event fields.
5.  **Map View:** A full-screen map with event markers. Tapping a marker shows a small info window with the event title and a button to view details.
6.  **Profile Screen:** Shows the user's profile picture, name, bio, and a list of events they have created or are attending."

---
---

### **Backend & Database Prompt for Psst..**

**Goal:** To generate the specific database schema and API endpoint structure.

**Prompt:**

"You are a senior backend engineer. Your task is to define the database schema and API contract for the 'Psst..' application.

**Technology Stack:**
*   **Framework:** FastAPI (Python)
*   **Database:** PostgreSQL with PostGIS extension
*   **Authentication:** Firebase (backend verifies tokens)

**1. Database Schema (PostgreSQL)**
Define the SQL `CREATE TABLE` statements for the following tables:

*   `users`:
    *   `id` (UUID, Primary Key)
    *   `firebase_uid` (TEXT, Unique, Not Null)
    *   `email` (TEXT, Unique, Not Null)
    *   `display_name` (TEXT)
    *   `created_at` (TIMESTAMPTZ, Default NOW())
*   `events`:
    *   `id` (UUID, Primary Key)
    *   `creator_id` (UUID, Foreign Key to `users.id`)
    *   `title` (TEXT, Not Null)
    *   `description` (TEXT)
    *   `start_time` (TIMESTAMPTZ, Not Null)
    *   `end_time` (TIMESTAMPTZ)
    *   `location` (GEOGRAPHY(Point, 4326), Not Null) - **Crucially, create a GIST index on this column for performance.**
    *   `created_at` (TIMESTAMPTZ, Default NOW())
*   `rsvps`:
    *   `event_id` (UUID, Foreign Key to `events.id`)
    *   `user_id` (UUID, Foreign Key to `users.id`)
    *   `status` (TEXT, e.g., 'interested', 'going')
    *   Primary Key on (`event_id`, `user_id`)

**2. API Endpoints (FastAPI)**
Define the structure for the following API endpoints. Specify the HTTP method, path, required request body (if any), and expected response.

*   **Authentication**
    *   `POST /auth/google`:
        *   **Body:** `{ "token": "firebase_google_id_token" }`
        *   **Response:** `{ "api_token": "our_own_jwt_or_session_token" }`
*   **Events**
    *   `POST /events`: (Protected) Create a new event.
    *   `GET /events/{event_id}`: Get details for a single event.
    *   `PUT /events/{event_id}`: (Protected) Update an event.
    *   `DELETE /events/{event_id}`: (Protected) Delete an event.
*   **Feed**
    *   `GET /feed?lat=...&lon=...&radius=...&page=...`: Get events near a location.
*   **RSVPs**
    *   `POST /events/{event_id}/rsvp`: (Protected)
        *   **Body:** `{ "status": "going" }`
        *   **Response:** Success/Failure message.

Implement these using FastAPI routers and Pydantic models for request/response validation."
