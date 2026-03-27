const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDB } = require('../../config/db');
const { ObjectId } = require('mongodb');

/**
 * User Signup
 * Endpoint: POST /api/users/signup
 * Creates a new user account after validating email uniqueness and hashing password.
 */
const signUp = async (req, res) => {
    try {
        const db = getDB();
        const { name, email, password, phone, address, lastLoginAt, createdAt } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password required" });
        }

        // Check if email already exists
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const result = await db.collection('users').insertOne({
            name,
            email,
            password: hashedPassword,
            phone: phone || null,
            address: address || null,
            role: "customer", // Default role
            createdAt: createdAt || new Date(),
            updatedAt: new Date(),
            lastLoginAt: lastLoginAt || null
        });

        res.status(201).json({ message: 'User created', userId: result.insertedId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * User Login
 * Endpoint: POST /api/users/login
 * Authenticates a user and returns a JWT token if successful.
 */
const login = async (req, res) => {
    try {
        const db = getDB();
        const { email, password, lastLoginAt } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        // Find user by email
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Update last login timestamp
        await db.collection('users').updateOne({ _id: user._id }, {
            $set: {
                lastLoginAt: lastLoginAt || new Date()
            }
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get User Profile
 * Endpoint: GET /api/users/profile
 * Retrieves the authenticated user's profile, excluding the password field.
 * Requires JWT authentication middleware that sets `req.user`.
 */
const getProfile = async (req, res) => {
    try {
        const db = getDB();

        // req.user.userId is set by authentication middleware
        const user = await db.collection('users').findOne(
            { _id: new ObjectId(req.user.userId) }, // Find by user ID
            { projection: { password: 0 } } // Exclude password from result
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const users = async (req, res) => {
    try {
        const db = getDB();
        const result = await db.collection('users').find().toArray();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getProfile, signUp, login, users };