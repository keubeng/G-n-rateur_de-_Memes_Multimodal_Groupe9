// src/config/env.js
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Validation des variables requises
const requiredEnv = ['PORT', 'GITHUB_TOKEN'];
const missingEnv = requiredEnv.filter(env => !process.env[env]);

if (missingEnv.length > 0) {
  console.error('Variables d\'environnement manquantes:', missingEnv.join(', '));
  console.error('Veuillez créer un fichier .env avec ces variables');
  console.error('Pour obtenir un token GitHub: https://github.com/settings/tokens');
  process.exit(1);
}

// Exporter les variables
module.exports = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  githubToken: process.env.GITHUB_TOKEN,
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024,
};