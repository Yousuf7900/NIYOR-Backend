require('dotenv').config(); // Load environment variables before anything else

const { connectDB } = require('./config/db');
const app = require('./app.js');

const PORT = process.env.PORT || 5000; // Fallback port if not defined

// Ensure DB connection is established before starting the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
});