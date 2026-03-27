const express = require('express');
const cors = require('cors');
const productRoutes = require('./modules/products/product.routes');
const userRoutes = require('./modules/users/user.routes');
const app = express();

app.use(express.json()); // Parse incoming JSON payloads
app.use(cors()); // Enable cross-origin requests

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

module.exports = app; // Export configured Express instance