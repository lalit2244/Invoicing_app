// File: backend/routes/pricelistRoutes.js
const express = require('express');
const router = express.Router();
const pricelistController = require('./pricelistController');
const authenticateToken = require('./authMiddleware');

// All routes require authentication
router.use(authenticateToken);

// GET /api/pricelist - Get all products
router.get('/', pricelistController.getAllProducts);

// GET /api/pricelist/:id - Get single product
router.get('/:id', pricelistController.getProduct);

// POST /api/pricelist - Create new product
router.post('/', pricelistController.createProduct);

// PUT /api/pricelist/:id - Update product
router.put('/:id', pricelistController.updateProduct);

// DELETE /api/pricelist/:id - Delete product
router.delete('/:id', pricelistController.deleteProduct);


module.exports = router;
