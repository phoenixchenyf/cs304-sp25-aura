const { MongoClient } = require('mongodb');  // Import MongoClient
const bcrypt = require('bcrypt');
const cs304 = require('./cs304');  // Assuming you're getting Mongo URI from cs304.js

const mongoUri = cs304.getMongoUri();  // Get Mongo URI from cs304

// Function to get the MongoDB users collection
let cachedDb = null;
const getUserCollection = async () => {
  const client = await MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = client.db('aura');  // Replace 'aura' with your actual DB name
  return db.collection('users');  // 'users' is your collection name
};

// Function to find a user by username
const findUser = async (username) => {
  const collection = await getUserCollection();
  return await collection.findOne({ username });
};

// Function to add a user (with hashed password)
const addUser = async (username, password, dob) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password
    const collection = await getUserCollection();
    await collection.insertOne({ username, password: hashedPassword, dob });
    console.log("User added successfully!");
  } catch (error) {
    console.error("Error adding user: ", error);
  }
};

// Function to verify user credentials
const verifyUser = async (username, password) => {
  const user = await findUser(username);
  if (!user) return false;
  return await bcrypt.compare(password, user.password);  // Compare the hashed password
};

module.exports = { findUser, addUser, verifyUser };