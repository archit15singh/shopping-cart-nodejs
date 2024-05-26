import express from 'express';
import CartController from '../controllers/cartController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, CartController.createCart);
router.get('/', authMiddleware, CartController.getUserCart);
router.post('/product', authMiddleware, CartController.addProductToCart);
router.delete('/product', authMiddleware, CartController.removeProductFromCart);
router.put('/product', authMiddleware, CartController.updateProductQuantity);
router.get('/summary', authMiddleware, CartController.getCartSummary);
router.delete('/', authMiddleware, CartController.emptyCart);
router.post('/discount', authMiddleware, CartController.applyDiscount);
router.post('/save', authMiddleware, CartController.saveCart);
router.get('/retrieve', authMiddleware, CartController.retrieveSavedCart);

export default router;
