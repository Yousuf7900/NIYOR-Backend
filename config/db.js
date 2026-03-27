const { MongoClient } = require('mongodb');

let db; // Shared database instance

const connectDB = async () => {
    try {
        if (db) {
            return db; // Reuse existing connection (prevents multiple connections)
        }

        const client = new MongoClient(process.env.MONGO_URI); // Initialize client with URI

        await client.connect(); // Establish connection to MongoDB server

        db = client.db(process.env.DatabaseName); // Select database

        console.log("MongoDB Connected Successfully");

        return db; // Return initialized DB instance
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1); // Terminate process on failure
    }
};

const getDB = () => {
    if (!db) {
        throw new Error("Database not initialized. Call connectDB first.");
    }
    return db; // Provide access to existing DB instance
};

module.exports = { connectDB, getDB };