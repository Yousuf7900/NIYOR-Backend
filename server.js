require('dotenv').config();

const { connectDB } = require('./config/db');
const app = require('./app.js');

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to start server:", error.message);
    });