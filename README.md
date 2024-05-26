# Shopping Cart Node.js

## Overview
A Node.js shopping cart application built using Test-Driven Development (TDD) and Object-Oriented Programming (OOP) principles.

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone git@github.com:archit15singh/shopping-cart-nodejs.git
   cd shopping-cart-nodejs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file with the following content:**
   ```plaintext
   PORT=3000
   DB_URI=mongodb://localhost:27017/shopping_cart
   JWT_SECRET=your_jwt_secret
   ```

4. **Run MongoDB using Docker and start the application:**
   ```bash
   docker run --name mongodb -p 27017:27017 --rm mongo
   ```

   ```bash
   npm start
   ```

5. **Run tests:**
   ```bash
   npm test
   ```

6. **Generate coverage report:**
   ```bash
   npx jest --coverage
   ```

## API Endpoints

### User Routes

#### POST /api/users/register
- **Description**: Register a new user.
- **Request Body**: 
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response Body**: 
  ```json
  {
    "message": "User registered successfully"
  }
  ```

#### POST /api/users/login
- **Description**: Log in a user.
- **Request Body**: 
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response Body**: 
  ```json
  {
    "token": "string"
  }
  ```

### Product Routes

#### POST /api/products
- **Description**: Create a new product.
- **Request Body**: 
  ```json
  {
    "name": "string",
    "price": "number",
    "stock": "number"
  }
  ```
- **Response Body**: 
  ```json
  {
    "_id": "string",
    "name": "string",
    "price": "number",
    "stock": "number",
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

#### GET /api/products
- **Description**: Get all products.
- **Response Body**: 
  ```json
  [
    {
      "_id": "string",
      "name": "string",
      "price": "number",
      "stock": "number",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
  ```

#### GET /api/products/:id
- **Description**: Get a product by ID.
- **URL Parameter**: `id` (Product ID)
- **Response Body**: 
  ```json
  {
    "_id": "string",
    "name": "string",
    "price": "number",
    "stock": "number",
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

#### PUT /api/products/:id
- **Description**: Update a product.
- **URL Parameter**: `id` (Product ID)
- **Request Body**: 
  ```json
  {
    "name": "string",
    "price": "number",
    "stock": "number"
  }
  ```
- **Response Body**: 
  ```json
  {
    "_id": "string",
    "name": "string",
    "price": "number",
    "stock": "number",
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

#### DELETE /api/products/:id
- **Description**: Delete a product.
- **URL Parameter**: `id` (Product ID)
- **Response Body**: 
  ```json
  {
    "message": "Product deleted successfully"
  }
  ```

### Cart Routes

#### POST /api/cart
- **Description**: Create a new cart.
- **Response Body**: 
  ```json
  {
    "_id": "string",
    "userId": "string",
    "products": [],
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

#### GET /api/cart
- **Description**: Get the user's cart.
- **Response Body**: 
  ```json
  {
    "_id": "string",
    "userId": "string",
    "products": [
      {
        "productId": "string",
        "quantity": "number"
      }
    ],
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

#### POST /api/cart/product
- **Description**: Add a product to the cart.
- **Request Body**: 
  ```json
  {
    "productId": "string",
    "quantity": "number"
  }
  ```
- **Response Body**: 
  ```json
  {
    "_id": "string",
    "userId": "string",
    "products": [
      {
        "productId": "string",
        "quantity": "number"
      }
    ],
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

#### DELETE /api/cart/product
- **Description**: Remove a product from the cart.
- **Request Body**: 
  ```json
  {
    "productId": "string"
  }
  ```
- **Response Body**: 
  ```json
  {
    "_id": "string",
    "userId": "string",
    "products": [],
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

#### PUT /api/cart/product
- **Description**: Update product quantity in the cart.
- **Request Body**: 
  ```json
  {
    "productId": "string",
    "quantity": "number"
  }
  ```
- **Response Body**: 
  ```json
  {
    "_id": "string",
    "userId": "string",
    "products": [
      {
        "productId": "string",
        "quantity": "number"
      }
    ],
    "createdAt": "string",
    "updatedAt": "string"
  }
  ```

#### GET /api/cart/summary
- **Description**: Get the cart summary.
- **Response Body**: 
  ```json
  {
    "itemCount": "number",
    "totalPrice": "number"
  }
  ```

#### DELETE /api/cart
- **Description**: Empty the cart.
- **Response Body**: 
  ```json
  {
    "message": "Cart emptied successfully"
  }
  ```

#### POST /api/cart/discount
- **Description**: Apply a discount code.
- **Request Body**: 
  ```json
  {
    "code": "string"
  }
  ```
- **Response Body**: 
  ```json
  {
    "discountApplied": "boolean",
    "totalPrice": "number"
  }
  ```

#### POST /api/cart/save
- **Description**: Save the cart for later.
- **Response Body**: 
  ```json
  {
    "message": "Cart saved successfully"
  }
  ```

#### GET /api/cart/retrieve
- **Description**: Retrieve the saved cart.
- **Response Body**: 
  ```json
  {
    "cart": {
      "_id": "string",
      "userId": "string",
      "products": [
        {
          "productId": "string",
          "quantity": "number"
        }
      ],
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```

## Models

### User Model
- **username**: String, required, unique
- **password**: String, required
- **createdAt**: Date, default: Date.now
- **updatedAt**: Date, default: Date.now

### Product Model
- **name**: String, required
- **price**: Number, required
- **description**: String
- **stock**: Number, required
- **createdAt**: Date, default: Date.now
- **updatedAt**: Date, default: Date.now

### Cart Model
- **userId**: ObjectId, ref: "User", required
- **products**: Array of `{ productId: ObjectId, quantity: Number }`
- **discountCode**: String
- **savedState**: Mixed
- **createdAt**: Date, default: Date.now
- **updatedAt**: Date, default: Date.now

## Tests

### Unit Tests
Located in `src/tests/unit`.
- **CartService**: Tests creation, addition, removal, and quantity update of cart products, and error handling for non-existent carts or invalid quantities.

### Integration Tests
Located in `src/tests/integration`.
- **Cart Routes**: 
  - Create a cart
  - Add/remove/update products in the cart
  - Apply discount codes
  - Save/retrieve the cart
  - Handle authentication
- **Product Routes**: 
  - Create/retrieve/update/delete products
  - Handle invalid data
  - Handle non-existent products
- **User Routes**: 
  - User registration
  - User login
  - Invalid login credentials
  - Missing fields during registration

### Client Tests
Located in `client/clientTests.js`.
- **Register User**
- **Login User**
- **Create

 Product**
- **Get All Products**
- **Get Product by ID**
- **Update Product**
- **Delete Product**
- **Create Cart**
- **Add Product to Cart**
- **Remove Product from Cart**
- **Update Product Quantity in Cart**
- **Get Cart Summary**
- **Empty Cart**
- **Apply Discount**
- **Save Cart**
- **Retrieve Saved Cart**
- **Chaos Monkey Tests**: Tests various failure scenarios like invalid product creation, adding non-existent products to the cart, invalid discount codes, and invalid user login.

## Additional Information

- **Development Tools**: Babel, Jest, Nodemon
- **Dependencies**: Express, Mongoose, JWT, Bcrypt, Axios, Dotenv
- **Environment**: MongoDB, Node.js
