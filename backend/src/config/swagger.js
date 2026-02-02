const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dynamic Survey Management System API',
      version: '1.0.0',
      description: 'API documentation for the Survey Management System with role-based access for Admin and Officer users',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'officer'] },
            status: { type: 'string', enum: ['active', 'inactive'] },
          },
        },
        Survey: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        SurveyField: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            survey_id: { type: 'integer' },
            label: { type: 'string' },
            field_type: { type: 'string', enum: ['text', 'textarea', 'checkbox', 'radio', 'select'] },
            is_required: { type: 'boolean' },
            order_index: { type: 'integer' },
          },
        },
        FieldOption: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            field_id: { type: 'integer' },
            label: { type: 'string' },
            value: { type: 'string' },
          },
        },
        Submission: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            survey_id: { type: 'integer' },
            user_id: { type: 'integer' },
            submitted_at: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
