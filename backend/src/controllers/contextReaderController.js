// src/controllers/contextReaderController.js
const aiService = require('../services/githubAIService');

const processText = async (req, res, next) => {
  try {
    const { text, culture } = req.body;

    console.log(`Requête reçue - Texte: "${text}" | Culture: ${culture || 'standard'}`);

    // Validation
    if (!text) {
      return res.status(400).json({
        error: 'Le champ "text" est requis dans le corps de la requête'
      });
    }

    if (typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        error: 'Le texte doit être une chaîne de caractères non vide'
      });
    }

    if (text.length > 1000) {
      return res.status(400).json({
        error: 'Le texte ne doit pas dépasser 1000 caractères'
      });
    }

    // Appel au service GitHub AI
    const result = await aiService.generateMemeFromText(text, culture || 'standard');

    res.status(200).json({
      success: true,
      data: result,
      metadata: {
        timestamp: new Date().toISOString(),
        textLength: text.length,
        culture: culture || 'standard',
        provider: 'github-models',
        version: '1.0.0'
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { processText };