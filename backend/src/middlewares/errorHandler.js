// src/middlewares/errorHandler.js
const config = require('../config/env');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';

  // Réponse d'erreur en fonction de l'environnement
  const errorResponse = {
    error: message,
    status: statusCode,
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  // En développement, ajouter la stack trace
  if (config.nodeEnv === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
