const jwt = require('jsonwebtoken');
const { getDB } = require('../../config/db');
const { ObjectId } = require('mongodb');

/**
 * User Signup
 * Endpoint: POST /api/users/signup
 * Creates a new user in the database.
 * Checks whether the email already exists before inserting.
 */
const signUp = async (req, res) => {
    try {
        const db = getDB();
        const { name, email, phone, lastLoginAt, createdAt } = req.body;
        console.log(req.body);

        // Check if email already exists
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        // Insert new user
        const result = await db.collection('users').insertOne({
            name,
            email,
            phone: phone || null,
            role: "customer",
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
 * Finds a user by email and updates the last login time.
 */
const login = async (req, res) => {
    try {
        const db = getDB();
        const { email, lastLoginAt } = req.body;

        // Find user by email
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update last login timestamp
        await db.collection('users').updateOne({ _id: user._id }, {
            $set: {
                lastLoginAt: lastLoginAt || new Date()
            }
        });

        return res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Social login
const socialAuth = async (req, res) => {
    try {
        const db = getDB();
        const {
            name,
            email,
            uid,
            phone,
            photoURL,
            createdAt,
            lastLoginAt,
            provider
        } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const existingUser = await db.collection('users').findOne({ email });

        if (!existingUser) {
            const newUser = {
                name: name || null,
                email,
                uid: uid || null,
                phone: phone || null,
                photoURL: photoURL || null,
                provider: provider || "google",
                role: "customer",
                createdAt: createdAt || new Date(),
                updatedAt: new Date(),
                lastLoginAt: lastLoginAt || new Date()
            };

            const result = await db.collection('users').insertOne(newUser);

            return res.status(201).json({
                message: "Social user created successfully",
                userId: result.insertedId,
                isNewUser: true
            });
        }

        await db.collection('users').updateOne(
            { _id: existingUser._id },
            {
                $set: {
                    name: name || existingUser.name || null,
                    uid: uid || existingUser.uid || null,
                    phone: phone || existingUser.phone || null,
                    photoURL: photoURL || existingUser.photoURL || null,
                    provider: provider || existingUser.provider || "google",
                    lastLoginAt: lastLoginAt || new Date(),
                    updatedAt: new Date()
                }
            }
        );

        return res.status(200).json({
            message: "Social login successful",
            userId: existingUser._id,
            isNewUser: false
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

/**
 * Get User Profile
 * Endpoint: GET /api/users/profile
 * Retrieves the authenticated user's profile.
 * Requires authentication middleware that sets req.user.
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

/**
 * Get All Users
 * Endpoint: GET /api/users
 * Returns all users from the database.
 */
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

/**
 * Create JWT
 * Endpoint: POST /api/users/jwt
 * Finds a user by email and creates a JWT token.
 */
const createJWT = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const db = getDB();
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const token = jwt.sign(
            { userId: user._id.toString(), role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.send({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { getProfile, signUp, login, users, createJWT, socialAuth };