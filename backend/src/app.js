const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const showAllUsers = require('./routes/userRoute');
const surveyRoutes = require('./routes/surveyRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Health check route
app.use("/api/auth", authRoutes);
app.use('/api/users', showAllUsers);
app.use('/api/surveys', surveyRoutes);
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});


module.exports = app;
