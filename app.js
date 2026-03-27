const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json()); // Parse incoming JSON payloads
app.use(cors()); // Enable cross-origin requests

module.exports = app; // Export configured Express instance