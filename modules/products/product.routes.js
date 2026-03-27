const express = require('express');
const router = express.Router();

const { createProduct, getProducts, deleteProduct, getProductById, updateProduct } = require('../products/product.controller');

router.get('/', getProducts);
router.post('/', createProduct);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;