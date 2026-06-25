// src/routes/contextReaderRoutes.js
const express = require('express');
const router = express.Router();
const { processText } = require('../controllers/contextReaderController');

// Endpoint principal : Context Reader
router.post('/', processText);

// Endpoint de test rapide (Juste pour simuler un test rapide)
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Context Reader endpoint is working!',
    usage: 'POST to /api/context-reader with { "text": "votre texte ici", "culture": "cameroon" }',
    example: {
      method: 'POST',
      url: '/api/context-reader',
      body: {
        text: 'Je suis trop fatigué ce matin',
        culture: 'cameroon'
      }
    }
  });
});

module.exports = router;
