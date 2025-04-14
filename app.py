from flask import Flask, redirect, render_template, request, make_response, session, abort, jsonify, url_for, flash
import secrets
from functools import wraps
import firebase_admin
from firebase_admin import credentials, firestore, auth
from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY')

# Configure session cookie settings
app.config['SESSION_COOKIE_SECURE'] = True  # Ensure cookies are sent over HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Prevent JavaScript access to cookies
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)  # Adjust session expiration as needed
app.config['SESSION_REFRESH_EACH_REQUEST'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # Can be 'Strict', 'Lax', or 'None'


# Firebase Admin SDK setup
cred = credentials.Certificate("firebase-auth.json")
firebase_admin.initialize_app(cred)
db = firestore.client()


########################################
""" Authentication and Authorization """

# Decorator for routes that require authentication
def auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check if user is authenticated
        if 'user' not in session:
            return redirect(url_for('landing'))
        
        else:
            return f(*args, **kwargs)
        
    return decorated_function


@app.route('/auth', methods=['POST'])
def authorize():
    token = request.headers.get('Authorization')
    if not token or not token.startswith('Bearer '):
        return "Unauthorized", 401

    token = token[7:]  # Strip off 'Bearer ' to get the actual token

    try:
        decoded_token = auth.verify_id_token(token, check_revoked=True, clock_skew_seconds=60) # Validate token here
        session['user'] = decoded_token # Add user to session
        print("User authenticated, redirecting to portfolio")
        return redirect(url_for('portfolio'))
    
    except Exception as e:
        print(f"Authentication error: {str(e)}")
        return "Unauthorized", 401


#####################
""" Public Routes """

# Landing page with login button
@app.route('/')
def landing():
    # If user is already logged in, redirect to portfolio
    if 'user' in session:
        return redirect(url_for('portfolio'))
    return render_template('landing.html')

# Login route (showing the login modal)
@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user' in session:
        return redirect(url_for('portfolio'))
    # Redirecting to landing page which has the login button
    return redirect(url_for('landing'))

# Signup route
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if 'user' in session:
        return redirect(url_for('portfolio'))
    return render_template('signup.html')

# Reset password route
@app.route('/reset-password', methods=['GET'])
def reset_password():
    if 'user' in session:
        return redirect(url_for('portfolio'))
    return render_template('forgot_password.html')

# Portfolio page (requires login)
@app.route('/portfolio')
@auth_required
def portfolio():
    print("Rendering portfolio page")
    return render_template('login.html')  # Using login.html as the portfolio template

# Dashboard page (requires login)
@app.route('/dashboard')
@auth_required
def dashboard():
    return render_template('dashboard.html')

@app.route('/logout')
def logout():
    session.pop('user', None)  # Remove the user from session
    response = make_response(redirect(url_for('landing')))
    response.set_cookie('session', '', expires=0)  # Optionally clear the session cookie
    return response

if __name__ == '__main__':
    app.run(debug=True)