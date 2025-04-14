import { auth, provider } from "./firebase-config.js";

import { createUserWithEmailAndPassword,
         signInWithEmailAndPassword,
         signInWithPopup,
         sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";



/* == UI - Elements == */
const signInWithGoogleButtonEl = document.getElementById("sign-in-with-google-btn")
const signUpWithGoogleButtonEl = document.getElementById("sign-up-with-google-btn")
const emailInputEl = document.getElementById("email-input")
const passwordInputEl = document.getElementById("password-input")
const signInButtonEl = document.getElementById("sign-in-btn")
const createAccountButtonEl = document.getElementById("create-account-btn")
const emailForgotPasswordEl = document.getElementById("email-forgot-password")
const forgotPasswordButtonEl = document.getElementById("forgot-password-btn")

const errorMsgEmail = document.getElementById("email-error-message")
const errorMsgPassword = document.getElementById("password-error-message")
const errorMsgGoogleSignIn = document.getElementById("google-signin-error-message")



/* == UI - Event Listeners == */
document.addEventListener('DOMContentLoaded', function() {
    // Re-acquire elements to ensure they're available after the DOM has loaded
    const signInWithGoogleButtonEl = document.getElementById("sign-in-with-google-btn")
    const signUpWithGoogleButtonEl = document.getElementById("sign-up-with-google-btn")
    const signInButtonEl = document.getElementById("sign-in-btn")
    const createAccountButtonEl = document.getElementById("create-account-btn")
    const forgotPasswordButtonEl = document.getElementById("forgot-password-btn")

    if (signInWithGoogleButtonEl) {
        signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle)
    }

    if (signInButtonEl) {
        signInButtonEl.addEventListener("click", authSignInWithEmail)
    }

    if (createAccountButtonEl) {
        createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)
    }

    if (signUpWithGoogleButtonEl) {
        signUpWithGoogleButtonEl.addEventListener("click", authSignUpWithGoogle)
    }

    if (forgotPasswordButtonEl) {
        forgotPasswordButtonEl.addEventListener("click", resetPassword)
    }
});



/* === Main Code === */

/* = Functions - Firebase - Authentication = */

// Function to sign in with Google authentication
async function authSignInWithGoogle() {
    console.log("Google sign-in initiated");
    // Configure Google Auth provider with custom parameters
    provider.setCustomParameters({
        'prompt': 'select_account'
    });

    try {
        // Attempt to sign in with a popup and retrieve user data
        const result = await signInWithPopup(auth, provider);

        // Check if the result or user object is undefined or null
        if (!result || !result.user) {
            throw new Error('Authentication failed: No user data returned.');
        }

        const user = result.user;
        const email = user.email;

        // Ensure the email is available in the user data
        if (!email) {
            throw new Error('Authentication failed: No email address returned.');
        }

        console.log("Google sign-in successful, getting ID token");
        // Retrieve ID token for the user
        const idToken = await user.getIdToken();

        // Log in the user using the obtained ID token
        loginUser(user, idToken);

    } catch (error) {
        // Handle errors by logging and potentially updating the UI
        console.error('Error during sign-in with Google:', error);
        if (errorMsgGoogleSignIn) {
            errorMsgGoogleSignIn.textContent = "Authentication failed. Please try again.";
        }
    }
}



// Function to create new account with Google auth - will also sign in existing users
async function authSignUpWithGoogle() {
    provider.setCustomParameters({
        'prompt': 'select_account'
    });

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const email = user.email;

        // Sign in user
        const idToken = await user.getIdToken();
        loginUser(user, idToken);
    } catch (error) {
        // The AuthCredential type that was used or other errors.
        console.error("Error during Google signup: ", error.message);
        // Handle error appropriately here, e.g., updating UI to show an error message
        if (errorMsgGoogleSignIn) {
            errorMsgGoogleSignIn.textContent = "Authentication failed. Please try again.";
        }
    }
}




function authSignInWithEmail() {
    console.log("Email sign-in initiated");
    
    const emailInputEl = document.getElementById("email-input");
    const passwordInputEl = document.getElementById("password-input");
    const errorMsgEmail = document.getElementById("email-error-message");
    const errorMsgPassword = document.getElementById("password-error-message");
    
    if (!emailInputEl || !passwordInputEl) {
        console.error("Email or password input elements not found");
        return;
    }

    const email = emailInputEl.value
    const password = passwordInputEl.value

    // Clear any previous error messages
    if (errorMsgEmail) errorMsgEmail.textContent = "";
    if (errorMsgPassword) errorMsgPassword.textContent = "";

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log("User signed in successfully");

            user.getIdToken().then(function(idToken) {
                loginUser(user, idToken)
            });

        })
        .catch((error) => {
            const errorCode = error.code;
            console.error("Error code: ", errorCode);
            
            if (errorCode === "auth/invalid-email") {
                if (errorMsgEmail) errorMsgEmail.textContent = "Invalid email";
            } else if (errorCode === "auth/invalid-credential") {
                if (errorMsgPassword) errorMsgPassword.textContent = "Login failed - invalid email or password";
            } else {
                if (errorMsgPassword) errorMsgPassword.textContent = "Login failed - please try again";
            }
        });
}



function authCreateAccountWithEmail() {
    const emailInputEl = document.getElementById("email-input");
    const passwordInputEl = document.getElementById("password-input");
    const errorMsgEmail = document.getElementById("email-error-message");
    const errorMsgPassword = document.getElementById("password-error-message");
    
    if (!emailInputEl || !passwordInputEl) {
        console.error("Email or password input elements not found");
        return;
    }

    const email = emailInputEl.value
    const password = passwordInputEl.value

    // Clear any previous error messages
    if (errorMsgEmail) errorMsgEmail.textContent = "";
    if (errorMsgPassword) errorMsgPassword.textContent = "";

    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log("User account created successfully");

            // Note: This function might not be defined depending on your app structure
            // If it's causing errors, you can comment it out or implement it
            try {
                await addNewUserToFirestore(user);
            } catch (e) {
                console.error("Could not add user to Firestore:", e);
                // Continue anyway since the Firebase Auth account was created
            }

            user.getIdToken().then(function(idToken) {
                loginUser(user, idToken)
            });
        })
        .catch((error) => {
            const errorCode = error.code;

            if (errorCode === "auth/invalid-email") {
                if (errorMsgEmail) errorMsgEmail.textContent = "Invalid email";
            } else if (errorCode === "auth/weak-password") {
                if (errorMsgPassword) errorMsgPassword.textContent = "Invalid password - must be at least 6 characters";
            } else if (errorCode === "auth/email-already-in-use") {
                if (errorMsgEmail) errorMsgEmail.textContent = "An account already exists for this email.";
            }
        });
}



function resetPassword() {
    const emailForgotPasswordEl = document.getElementById("email-forgot-password");
    
    if (!emailForgotPasswordEl) {
        console.error("Email input for password reset not found");
        return;
    }

    const emailToReset = emailForgotPasswordEl.value

    clearInputField(emailForgotPasswordEl)

    sendPasswordResetEmail(auth, emailToReset)
    .then(() => {
        // Password reset email sent!
        const resetFormView = document.getElementById("reset-password-view")
        const resetSuccessView = document.getElementById("reset-password-confirmation-page")

        if (resetFormView) resetFormView.style.display = "none";
        if (resetSuccessView) resetSuccessView.style.display = "block";
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Password reset error:", errorMessage);
    });
}



function loginUser(user, idToken) {
    console.log("Sending authentication request to server");
    
    fetch('/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
        credentials: 'same-origin'  // Ensures cookies are sent with the request
    }).then(response => {
        if (response.ok) {
            console.log("Authentication successful, redirecting to portfolio");
            window.location.href = '/portfolio';
        } else {
            console.error('Failed to login:', response.status, response.statusText);
            // Display error message to the user
            const errorMsgGoogleSignIn = document.getElementById("google-signin-error-message");
            if (errorMsgGoogleSignIn) {
                errorMsgGoogleSignIn.textContent = "Server authentication failed. Please try again.";
            }
        }
    }).catch(error => {
        console.error('Error with Fetch operation: ', error);
        const errorMsgGoogleSignIn = document.getElementById("google-signin-error-message");
        if (errorMsgGoogleSignIn) {
            errorMsgGoogleSignIn.textContent = "Authentication error. Please try again.";
        }
    });
}

// Helper function to add a new user to Firestore if needed
async function addNewUserToFirestore(user) {
    // This is a placeholder - implement if needed for your application
    console.log("Would add user to Firestore:", user.uid);
    // In a real implementation, you would add code to store user data in Firestore
    return true;
}



// /* = Functions - UI = */
function clearInputField(field) {
	field.value = ""
}

function clearAuthFields() {
    const emailInputEl = document.getElementById("email-input");
    const passwordInputEl = document.getElementById("password-input");
    
	if (emailInputEl) clearInputField(emailInputEl);
	if (passwordInputEl) clearInputField(passwordInputEl);
}


