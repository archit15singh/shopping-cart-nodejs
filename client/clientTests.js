import axios from 'axios';

const baseURL = 'http://localhost:3000/api';
const userCredentials = { username: 'testuser', password: 'password' };
let token;
let productId;
let productId2;

const setupAxios = () => {
  axios.interceptors.request.use(config => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });
};

const registerUser = async () => {
  try {
    const response = await axios.post(`${baseURL}/users/register`, userCredentials);
    console.log('User registration response:', response.data);
  } catch (error) {
    console.error('Error registering user:', error.response.data);
  }
};

const loginUser = async () => {
  try {
    const response = await axios.post(`${baseURL}/users/login`, userCredentials);
    token = response.data.token;
    console.log('User login response:', response.data);
  } catch (error) {
    console.error('Error logging in user:', error.response.data);
  }
};

const createProduct = async (name, price, stock) => {
  try {
    const response = await axios.post(`${baseURL}/products`, { name, price, stock });
    console.log('Product creation response:', response.data);
    return response.data._id;
  } catch (error) {
    console.error('Error creating product:', error.response.data);
  }
};

const getAllProducts = async () => {
  try {
    const response = await axios.get(`${baseURL}/products`);
    console.log('Get all products response:', response.data);
  } catch (error) {
    console.error('Error getting all products:', error.response.data);
  }
};

const getProductById = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/products/${id}`);
    console.log('Get product by ID response:', response.data);
  } catch (error) {
    console.error('Error getting product by ID:', error.response.data);
  }
};

const updateProduct = async (id, name) => {
  try {
    const response = await axios.put(`${baseURL}/products/${id}`, { name });
    console.log('Product update response:', response.data);
  } catch (error) {
    console.error('Error updating product:', error.response.data);
  }
};

const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${baseURL}/products/${id}`);
    console.log('Product deletion response:', response.data);
  } catch (error) {
    console.error('Error deleting product:', error.response.data);
  }
};

const createCart = async () => {
  try {
    const response = await axios.post(`${baseURL}/cart`);
    cartId = response.data._id;
    console.log('Cart creation response:', response.data);
  } catch (error) {
    console.error('Error creating cart:', error.response.data);
  }
};

const addProductToCart = async (productId, quantity) => {
  try {
    const response = await axios.post(`${baseURL}/cart/product`, { productId, quantity });
    console.log('Add product to cart response:', response.data);
  } catch (error) {
    console.error('Error adding product to cart:', error.response.data);
  }
};

const removeProductFromCart = async (productId) => {
  try {
    const response = await axios.delete(`${baseURL}/cart/product`, { data: { productId } });
    console.log('Remove product from cart response:', response.data);
  } catch (error) {
    console.error('Error removing product from cart:', error.response.data);
  }
};

const updateProductQuantityInCart = async (productId, quantity) => {
  try {
    const response = await axios.put(`${baseURL}/cart/product`, { productId, quantity });
    console.log('Update product quantity in cart response:', response.data);
  } catch (error) {
    console.error('Error updating product quantity in cart:', error.response.data);
  }
};

const getCartSummary = async () => {
  try {
    const response = await axios.get(`${baseURL}/cart/summary`);
    console.log('Get cart summary response:', response.data);
  } catch (error) {
    console.error('Error getting cart summary:', error.response.data);
  }
};

const emptyCart = async () => {
  try {
    const response = await axios.delete(`${baseURL}/cart`);
    console.log('Empty cart response:', response.data);
  } catch (error) {
    console.error('Error emptying cart:', error.response.data);
  }
};

const applyDiscount = async (code) => {
  try {
    const response = await axios.post(`${baseURL}/cart/discount`, { code });
    console.log('Apply discount response:', response.data);
  } catch (error) {
    console.error('Error applying discount:', error.response.data);
  }
};

const saveCart = async () => {
  try {
    const response = await axios.post(`${baseURL}/cart/save`);
    console.log('Save cart response:', response.data);
  } catch (error) {
    console.error('Error saving cart:', error.response.data);
  }
};

const retrieveSavedCart = async () => {
  try {
    const response = await axios.get(`${baseURL}/cart/retrieve`);
    console.log('Retrieve saved cart response:', response.data);
  } catch (error) {
    console.error('Error retrieving saved cart:', error.response.data);
  }
};

// Edge case tests
const chaosMonkeyTests = async () => {
  try {
    // Test invalid product creation
    await axios.post(`${baseURL}/products`, { name: '', price: -100, stock: -10 });

    // Test adding non-existent product to cart
    await axios.post(`${baseURL}/cart/product`, { productId: 'nonexistentproduct', quantity: 1 });

    // Test removing non-existent product from cart
    await axios.delete(`${baseURL}/cart/product`, { data: { productId: 'nonexistentproduct' } });

    // Test updating quantity of non-existent product in cart
    await axios.put(`${baseURL}/cart/product`, { productId: 'nonexistentproduct', quantity: 5 });

    // Test invalid discount code
    await applyDiscount('INVALIDCODE');

    // Test invalid login
    await axios.post(`${baseURL}/users/login`, { username: 'invaliduser', password: 'invalidpassword' });
  } catch (error) {
    console.error('Chaos monkey test error:', error.response ? error.response.data : error.message);
  }
};

const runTests = async () => {
  setupAxios();
  await registerUser();
  await loginUser();

  productId = await createProduct('Test Product 1', 100, 10);
  productId2 = await createProduct('Test Product 2', 200, 5);

  await getAllProducts();
  await getProductById(productId);
  await updateProduct(productId, 'Updated Product 1');
  await getProductById(productId);

  await createCart();
  await addProductToCart(productId, 1);
  await addProductToCart(productId2, 2);

  await getCartSummary();
  await updateProductQuantityInCart(productId, 3);
  await getCartSummary();

  await saveCart();
  await emptyCart();
  await retrieveSavedCart();

  await applyDiscount('DISCOUNT10');

  await removeProductFromCart(productId);
  await getCartSummary();

  await deleteProduct(productId);
  await deleteProduct(productId2);

  await chaosMonkeyTests();
};

runTests();
