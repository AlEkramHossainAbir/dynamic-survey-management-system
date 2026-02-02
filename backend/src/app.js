const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const showAllUsers = require('./routes/userRoute');
const surveyRoutes = require('./routes/surveyRoutes');
const surveySubmissionRoutes = require('./routes/surveySubmission');
const { swaggerUi, specs } = require('./config/swagger');



const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Survey API Documentation',
}));

// Health check route
app.use("/api/auth", authRoutes);
app.use('/api/users', showAllUsers);
app.use('/api/admin/surveys', surveyRoutes);
app.use('/api/officer/surveys', surveySubmissionRoutes);
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});


module.exports = app;
