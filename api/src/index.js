const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { testConnection } = require('./config/database');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Tareas Casa API Docs'
}));

// Swagger JSON
app.get('/api/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes
app.use('/api', routes);

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  await testConnection();
  
  app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
    console.log(`Swagger docs at http://localhost:${port}/api/docs`);
  });
};

startServer();

module.exports = app;
