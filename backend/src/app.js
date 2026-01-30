const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/users', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});


module.exports = app;
