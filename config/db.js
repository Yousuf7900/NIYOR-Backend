const { MongoClient } = require('mongodb');

let db;
let client;

const connectDB = async () => {
    try {
        if (db) return db;

        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in .env");
        }

        if (!process.env.DatabaseName) {
            throw new Error("DatabaseName is missing in .env");
        }

        client = new MongoClient(process.env.MONGO_URI);
        await client.connect();

        db = client.db(process.env.DatabaseName);

        console.log("MongoDB Connected Successfully");
        return db;
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        throw error;
    }
};

const getDB = () => {
    if (!db) {
        throw new Error("Database not initialized. Call connectDB first.");
    }
    return db;
};

module.exports = { connectDB, getDB };