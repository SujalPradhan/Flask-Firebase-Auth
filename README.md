# Flask Firebase Authentication Template

A ready-to-use web application template integrating Flask with Firebase Authentication for secure user management.

## Features

### 🔥 Firebase Authentication Integration
- **Multiple Sign-in Methods**: Email/password and Google OAuth authentication
- **JWT Token Verification**: Server-side validation of Firebase authentication tokens
- **Session Management**: Secure handling of user sessions with Flask
- **Protected Routes**: Endpoint security using Firebase authentication status

### 🛠️ Technical Implementation
- Client-side authentication using Firebase JavaScript SDK
- Server-side token verification with Firebase Admin SDK
- Secure cookie-based session management
- Responsive frontend design

## Project Structure

```
Flask-Firebase-Template/
├── app.py                 # Main Flask application
├── firebase_config.py     # Firebase configuration for Python
├── firebase-auth.json     # Firebase Admin SDK credentials
├── static/
│   ├── firebase-config.js # Firebase client configuration
│   ├── login-auth.js      # Client-side authentication logic
│   ├── portfolio.js       # Portfolio page functionality
│   └── styles/            # CSS stylesheets
└── templates/
    ├── login.html         # Authentication page
    ├── navbar_public.html # Navigation component
    └── portfolio.html     # Main application page
```

## Authentication Flow

1. User initiates authentication through the login page
2. Firebase JavaScript SDK handles the authentication process
3. Upon successful authentication, a JWT token is generated
4. The token is sent to the Flask backend for verification
5. Backend verifies the token using Firebase Admin SDK
6. A session is created to maintain user authentication state
7. Protected routes check for valid session before access

## Setup Instructions

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable desired authentication methods (Email/Password, Google, etc.)
3. Generate a Firebase Admin SDK service account key and save as `firebase-auth.json`
4. Set up Firebase configuration:
   - Copy `static/firebase-config.template.js` to `static/firebase-config.js`
   - Replace placeholder values with your Firebase project details
5. Install dependencies: `pip install -r requirements.txt`
6. Run the application: `python app.py`

## Firebase Configuration Setup

For security reasons, Firebase configuration is not included in the repository.

1. Copy the template file: `cp static/firebase-config.template.js static/firebase-config.js`
2. Update `static/firebase-config.js` with your Firebase project details:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

## Security Features

- Server-side token verification
- CSRF protection
- Secure cookie configuration
- Proper session management
- Firebase Rules implementation for database security

## Use Cases

- Portfolio websites with protected admin sections
- SaaS applications requiring user authentication
- Web applications with user-specific content
- Projects demonstrating Firebase integration skills

---

This project demonstrates proficiency with Firebase Authentication services and their integration with server-side technologies like Flask, showcasing security best practices for web application development.