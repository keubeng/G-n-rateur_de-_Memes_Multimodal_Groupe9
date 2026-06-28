const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier audio reçu.' });
  }

  try {
    const audioBuffer = fs.readFileSync(req.file.path);
    const audioBase64 = audioBuffer.toString('base64');

    const prompt = `Voici une note vocale audio.
1. Transcris d'abord exactement ce qui est dit.
2. Ensuite, génère une courte légende de meme drôle (1-2 phrases) basée sur le ton et le contenu de cet audio. Tu peux utiliser des expressions camerounaises typiques (français camerounais) si ça rend le meme plus drôle, sans en faire trop.

Réponds STRICTEMENT et UNIQUEMENT avec un objet JSON valide, sans aucun texte avant ou après, sans markdown, au format exact suivant (utilise des guillemets doubles, et n'utilise aucun guillemet à l'intérieur des valeurs) :
{"transcription": "texte ici", "memeText": "texte ici"}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: 'audio/wav',
                  data: audioBase64,
                },
              },
            ],
          },
        ],
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    let rawText = response.data.candidates[0].content.parts[0].text.trim();
    console.log('Réponse brute de Gemini :', rawText);

    // Nettoyage : enlever les balises markdown éventuelles
    rawText = rawText.replace(/```json|```/g, '').trim();

    // Extraire uniquement la partie entre la première { et la dernière }
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
      // Fallback : on renvoie le texte brut comme memeText pour ne pas bloquer l'utilisateur
      parsed = { transcription: '', memeText: rawText };
    }

    fs.unlinkSync(req.file.path);

    res.json({
      transcription: parsed.transcription || '',
      memeText: parsed.memeText || rawText,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Erreur lors du traitement audio.' });
  }
});

module.exports = router;