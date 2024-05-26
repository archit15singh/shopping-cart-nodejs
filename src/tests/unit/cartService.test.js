import CartService from '../../src/services/cartService.js';
import Cart from '../../src/models/cart.js';

jest.mock('../../src/models/cart.js');

describe('CartService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new cart', async () => {
    const mockSave = jest.fn().mockResolvedValue({ _id: '1', userId: '123', products: [] });
    Cart.mockImplementation(() => ({ save: mockSave }));
    
    const cart = await CartService.createCart('123');
    
    expect(cart).toHaveProperty('_id');
    expect(cart).toHaveProperty('userId', '123');
    expect(cart.products).toEqual([]);
  });

  it('should add a product to the cart', async () => {
    const mockSave = jest.fn();
    const mockFindOne = jest.fn().mockResolvedValue({
      userId: '123',
      products: [],
      save: mockSave
    });
    Cart.findOne = mockFindOne;

    const cart = await CartService.addProductToCart('123', '456', 1);
    
    expect(cart.products).toHaveLength(1);
    expect(cart.products[0]).toHaveProperty('productId', '456');
    expect(cart.products[0]).toHaveProperty('quantity', 1);
  });

  it('should remove a product from the cart', async () => {
    const mockSave = jest.fn();
    const mockFindOne = jest.fn().mockResolvedValue({
      userId: '123',
      products: [{ productId: '456', quantity: 1 }],
      save: mockSave
    });
    Cart.findOne = mockFindOne;

    const cart = await CartService.removeProductFromCart('123', '456');
    
    expect(cart.products).toHaveLength(0);
  });

  it('should update product quantity in the cart', async () => {
    const mockSave = jest.fn();
    const mockFindOne = jest.fn().mockResolvedValue({
      userId: '123',
      products: [{ productId: '456', quantity: 1 }],
      save: mockSave
    });
    Cart.findOne = mockFindOne;

    const cart = await CartService.updateProductQuantity('123', '456', 5);
    
    expect(cart.products).toHaveLength(1);
    expect(cart.products[0]).toHaveProperty('quantity', 5);
  });

  it('should throw an error if cart not found when adding product', async () => {
    Cart.findOne = jest.fn().mockResolvedValue(null);

    await expect(CartService.addProductToCart('123', '456', 1)).rejects.toThrow('Cart not found');
  });

  it('should throw an error if cart not found when removing product', async () => {
    Cart.findOne = jest.fn().mockResolvedValue(null);

    await expect(CartService.removeProductFromCart('123', '456')).rejects.toThrow('Cart not found');
  });

  it('should throw an error if cart not found when updating product quantity', async () => {
    Cart.findOne = jest.fn().mockResolvedValue(null);

    await expect(CartService.updateProductQuantity('123', '456', 5)).rejects.toThrow('Cart not found');
  });
});
