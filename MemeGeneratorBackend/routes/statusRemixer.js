const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucune image reçue.' });
  }

  try {
    const imageBuffer = fs.readFileSync(req.file.path);
    const imageBase64 = imageBuffer.toString('base64');
    const mimeType = req.file.mimetype || 'image/jpeg';

    const prompt = `Regarde cette image attentivement. Génère une courte légende de meme drôle et percutante (1 à 2 phrases max) adaptée au contenu visuel de l'image. Tu peux utiliser des expressions camerounaises typiques (français camerounais) si ça rend le meme plus drôle et naturel, sans en faire trop.

Réponds STRICTEMENT et UNIQUEMENT avec un objet JSON valide, sans aucun texte avant ou après, sans markdown, au format exact suivant (utilise des guillemets doubles, n'utilise aucun guillemet à l'intérieur des valeurs) :
{"memeText": "texte ici"}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: imageBase64,
                },
              },
            ],
          },
        ],
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    let rawText = response.data.candidates[0].content.parts[0].text.trim();
    rawText = rawText.replace(/```json|```/g, '').trim();

    const firstBrace = rawText.indexOf('{');
    const lastBrace = rawText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      rawText = rawText.substring(firstBrace, lastBrace + 1);
    }

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (parseErr) {
      console.error('Échec du parsing JSON, réponse brute :', rawText);
      parsed = { memeText: rawText };
    }

    fs.unlinkSync(req.file.path);

    res.json({ memeText: parsed.memeText || rawText });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Erreur lors de l'analyse de l'image." });
  }
});

module.exports = router;