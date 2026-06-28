const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
  const { text, localCulture } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Le champ "text" est requis.' });
  }

  try {
    const localInstruction = localCulture
      ? ' Utilise si possible des expressions camerounaises ou du français camerounais typique (par exemple : "on est ensemble", "ça va aller", "c\'est dead", "tu es chaud"), sans en faire trop.'
      : '';

    const prompt = `Tu génères une courte légende de meme drôle et percutante (1 à 2 phrases max) basée sur le ton et la situation suivante.${localInstruction} Réponds uniquement avec la légende, sans aucune explication ni guillemets.\n\nSituation : ${text}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const memeText = response.data.candidates[0].content.parts[0].text.trim();
    res.json({ memeText });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Erreur lors de la génération du meme.' });
  }
});

module.exports = router;