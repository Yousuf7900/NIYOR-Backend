const express = require('express');
const router = express.Router();
const { signUp, login, users, getProfile, createJWT, socialAuth } = require('./user.controller');
const verifyToken = require('../../../middlewares/verifyToken.js');

/**
 * User Signup
 * Endpoint: POST /api/users/signup
 * Creates a new user account.
 */
router.post('/signup', signUp);

/**
 * User Login
 * Endpoint: POST /api/users/login
 * Authenticates user credentials and returns JWT token.
 */
router.post('/login', login);

// social auth
router.post('/social-auth', socialAuth);

/**
 * Get All Users
 * Endpoint: GET /api/users/
 * Returns a list of all users (for admin or testing purposes).
 */
router.post('/jwt', createJWT);
router.get('/', users);


/**
 * Get Authenticated User Profile
 * Endpoint: GET /api/users/me
 * Requires JWT authentication via verifyToken middleware.
 * Returns the profile of the logged-in user, excluding password.
 */
router.get('/me', verifyToken, getProfile);


module.exports = router;