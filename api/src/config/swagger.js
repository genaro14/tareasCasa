const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tareas Casa API',
      version: '1.0.0',
      description: 'API para gestionar comidas, lista de supermercado y tareas del hogar',
      contact: {
        name: 'Tareas Casa'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'API Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'gena' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', example: 'gena' },
            password: { type: 'string', example: 'changeme' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: { $ref: '#/components/schemas/User' }
          }
        },
        ChangePasswordRequest: {
          type: 'object',
          required: ['currentPassword', 'newPassword'],
          properties: {
            currentPassword: { type: 'string', example: 'changeme' },
            newPassword: { type: 'string', example: 'newpassword123' }
          }
        },
        Meal: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            date: { type: 'string', format: 'date', example: '2024-01-15' },
            meal_name: { type: 'string', example: 'Pizza casera' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        MealRequest: {
          type: 'object',
          required: ['date', 'meal_name'],
          properties: {
            date: { type: 'string', format: 'date', example: '2024-01-15' },
            meal_name: { type: 'string', example: 'Pizza casera' }
          }
        },
        GroceryItem: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Leche' },
            is_active: { type: 'boolean', example: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        GroceryItemRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Leche' }
          }
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            task_name: { type: 'string', example: 'Limpiar el baño' },
            due_date: { type: 'string', format: 'date', example: '2024-01-15' },
            is_completed: { type: 'boolean', example: false },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        TaskRequest: {
          type: 'object',
          required: ['task_name', 'due_date'],
          properties: {
            task_name: { type: 'string', example: 'Limpiar el baño' },
            due_date: { type: 'string', format: 'date', example: '2024-01-15' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Error message' }
          }
        },
        Health: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'ok' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
