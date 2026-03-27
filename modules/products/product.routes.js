const express = require('express');
const router = express.Router();

const {
    createProduct,
    getProducts,
    deleteProduct,
    getProductById,
    updateProduct
} = require('../products/product.controller');

// Get all products
// Endpoint: GET /api/products
router.get('/', getProducts);

// Create a new product
// Endpoint: POST /api/products
router.post('/', createProduct);

// Get a single product by ID
// Endpoint: GET /api/products/:id
router.get('/:id', getProductById);

// Update a product by ID
// Endpoint: PUT /api/products/:id
router.put('/:id', updateProduct);

// Delete a product by ID
// Endpoint: DELETE /api/products/:id
router.delete('/:id', deleteProduct);

module.exports = router;