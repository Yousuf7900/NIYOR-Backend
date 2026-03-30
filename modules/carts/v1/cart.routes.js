const express = require('express');
const router = express.Router();

const { addCart, getCartByEmail, deleteCartItem, clearCartByEmail, updateCartQty } = require('./cart.controller');

router.post('/', addCart);
router.get('/', getCartByEmail);
router.delete('/clear', clearCartByEmail);
router.patch('/:id', updateCartQty);
router.delete('/:id', deleteCartItem);

module.exports = router;