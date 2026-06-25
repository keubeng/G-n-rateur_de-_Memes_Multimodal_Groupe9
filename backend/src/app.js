// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');

// Import des routes
const contextReaderRoutes = require('./routes/contextReaderRoutes');

const app = express();

// Middlewares globaux
app.use(helmet()); // Sécurise les en-têtes HTTP

// Configuration CORS pour le développement
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev')); // Logging des requêtes

// Routes
app.use('/api/context-reader', contextReaderRoutes);

// Route de santé (health check)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Monstre Meme Generator API is running!',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      contextReader: '/api/context-reader',
      contextReaderTest: '/api/context-reader/test'
    }
  });
});

// Gestionnaire d'erreurs global (doit être le dernier middleware)
app.use(errorHandler);

// Gestion des routes 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée', 
    path: req.path 
  });
});

module.exports = app;
