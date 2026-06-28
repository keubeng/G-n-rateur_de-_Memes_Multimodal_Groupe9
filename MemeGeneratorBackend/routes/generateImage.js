const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
  const { context } = req.body;

  if (!context) {
    return res.status(400).json({ error: 'Le champ "context" est requis.' });
  }

  try {
    // Étape 1 : générer un prompt visuel en anglais à partir du contexte
    const promptGenResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{
              text: `À partir de cette situation : "${context}", écris UNE SEULE phrase descriptive en anglais pour générer une image de meme humoristique et absurde (style image drôle, pas de texte sur l'image). Réponds uniquement avec la phrase descriptive, sans explication.`
            }],
          },
        ],
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const imagePrompt = promptGenResponse.data.candidates[0].content.parts[0].text.trim();

    // Étape 2 : générer l'image via Pollinations.ai (gratuit, sans clé)
    const encodedPrompt = encodeURIComponent(imagePrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=768&nologo=true`;

    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    const base64Image = Buffer.from(imageResponse.data).toString('base64');

    res.json({ imageBase64: base64Image, usedPrompt: imagePrompt });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Erreur lors de la génération de l'image." });
  }
});

module.exports = router;