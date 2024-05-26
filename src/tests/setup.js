jest.setTimeout(30000);

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

beforeAll(async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
});
