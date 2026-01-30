// src/models/userModel.js
const prisma = require('../config/db');

// Find user by email
const findUserByEmail = async (email) => {
  return await prisma.users.findUnique({
    where: { email }
  });
};

// Create user (for seeding/admin)
const createUser = async ({ name, email, password, role }) => {
  return await prisma.users.create({
    data: { name, email, password, role }
  });
};

module.exports = { findUserByEmail, createUser };
