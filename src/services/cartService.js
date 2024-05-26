import Cart from '../models/cart.js';

class CartService {
  static async createCart(userId) {
    const cart = new Cart({ userId });
    await cart.save();
    return cart;
  }

  static async addProductToCart(userId, productId, quantity) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Cart not found');

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId.toString());
    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await cart.save();
    return cart;
  }

  static async removeProductFromCart(userId, productId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Cart not found');

    cart.products = cart.products.filter(p => p.productId.toString() !== productId.toString());
    await cart.save();
    return cart;
  }

  static async updateProductQuantity(userId, productId, quantity) {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error('Cart not found');

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId.toString());
    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
    } else {
      throw new Error('Product not found in cart');
    }

    await cart.save();
    return cart;
  }
}

export default CartService;
