import Cart from '../models/cart.js';
import { discountCodes } from '../utils/discountCodes.js';

class CartController {
  static async createCart(req, res) {
    try {
      const cart = new Cart({ userId: req.user.id });
      await cart.save();
      res.status(201).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUserCart(req, res) {
    try {
      const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addProductToCart(req, res) {
    try {
      const { productId, quantity } = req.body;
      const cart = await Cart.findOne({ userId: req.user.id });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });

      const productIndex = cart.products.findIndex(p => p.productId.equals(productId));
      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }

      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async removeProductFromCart(req, res) {
    try {
      const { productId } = req.body;
      const cart = await Cart.findOne({ userId: req.user.id });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });

      cart.products = cart.products.filter(p => !p.productId.equals(productId));
      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateProductQuantity(req, res) {
    try {
      const { productId, quantity } = req.body;
      const cart = await Cart.findOne({ userId: req.user.id });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });

      const productIndex = cart.products.findIndex(p => p.productId.equals(productId));
      if (productIndex > -1) {
        cart.products[productIndex].quantity = quantity;
      } else {
        return res.status(404).json({ message: 'Product not found in cart' });
      }

      await cart.save();
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCartSummary(req, res) {
    try {
      const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
      if (!cart) return res.status(404).json({ message: 'Cart not found' });

      const itemCount = cart.products.reduce((acc, item) => acc + item.quantity, 0);
      const totalPrice = cart.products.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

      res.json({ itemCount, totalPrice });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async emptyCart(req, res) {
    try {
      const cart = await Cart.findOne({ userId: req.user.id });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });

      cart.products = [];
      await cart.save();
      res.status(200).json({ message: 'Cart emptied successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async applyDiscount(req, res) {
    try {
      const { code } = req.body;
      const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');

      if (!cart) return res.status(404).json({ message: 'Cart not found' });

      const discount = discountCodes[code] || 0;
      const discountApplied = !!discount;
      const totalPrice = cart.products.reduce((acc, item) => acc + item.productId.price * item.quantity, 0) * (1 - discount);

      cart.discountCode = discountApplied ? code : null;
      await cart.save();

      res.json({ discountApplied, totalPrice });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async saveCart(req, res) {
    try {
      const cart = await Cart.findOne({ userId: req.user.id });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });

      cart.savedState = cart.products;
      await cart.save();

      res.status(200).json({ message: 'Cart saved successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async retrieveSavedCart(req, res) {
    try {
      const cart = await Cart.findOne({ userId: req.user.id });
      if (!cart) return res.status(404).json({ message: 'Cart not found' });

      cart.products = cart.savedState || [];
      await cart.save();

      res.status(200).json({ cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default CartController;

