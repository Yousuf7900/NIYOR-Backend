const express = require('express');
const cors = require('cors');
const productRoutes = require('./modules/products/v1/product.routes');
const userRoutes = require('./modules/users/v1/user.routes');
const cartRoutes = require('./modules/carts/v1/cart.routes');
const app = express();

app.use(express.json()); // Parse incoming JSON payloads
app.use(cors(
    {
        origin: 'http://localhost:5173'
    }
)); // Enable cross-origin requests

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/cart', cartRoutes);

module.exports = app; // Export configured Express instance