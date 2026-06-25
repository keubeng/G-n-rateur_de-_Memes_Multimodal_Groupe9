// src/services/githubAIService.js
const OpenAI = require('openai');
const config = require('../config/env');

class GithubAIService {
  constructor() {
    // Utilisation de l'API GitHub Models
    this.client = new OpenAI({
      baseURL: "https://models.github.ai/inference",
      apiKey: config.githubToken,
      defaultHeaders: {
        'Authorization': `Bearer ${config.githubToken}`
      }
    });
  }

  /**
   * Génère un meme à partir d'un texte avec les modèles GitHub
   */
  async generateMemeFromText(text, culture = 'standard') {
    try {
      // Construction du prompt avec localisation culturelle
      let culturalContext = '';
      if (culture === 'cameroon') {
        culturalContext = `Utilise des références, expressions et humour camerounais.
          Sois créatif avec des punchlines à la camerounaise.
          Références possibles : le ndolé, le poisson braisé, le moto-taxi,
          les embouteillages à Yaoundé/Douala, les "mbenguistes", etc.`;
      }

      const prompt = `Tu es un expert en génération de memes humoristiques.
        Analyse le texte suivant et génère une punchline ou un concept de meme hilarant.

        Texte: "${text}"

        ${culturalContext}

        Réponds au format JSON suivant (valide en JSON):
        {
          "originalText": "${text}",
          "punchline": "la punchline générée",
          "memeConcept": "description du visuel suggéré",
          "humorLevel": 1-10,
          "suggestedHashtags": ["#tag1", "#tag2"]
        }`;

      console.log('###--> Envoi de la requête à GitHub Models...');

      // Appel à l'API GitHub Models
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un générateur de memes professionnel. Réponds toujours en JSON valide.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 300,
        response_format: { type: "json_object" }
      });

      console.log('Réponse reçue de GitHub Models');

      // Parser la réponse JSON
      const result = JSON.parse(response.choices[0].message.content);
      return result;

    } catch (error) {
      console.error(' Erreur GitHub Models:', error.message);

      // En cas d'erreur, retourner des données mockées pour le développement
      if (config.nodeEnv === 'development') {
        console.log('Utilisation des données mockées (mode développement)');
        return {
          originalText: text,
          punchline: `"${text}" - Pingouin ou pas ? (mode démo GitHub)`,
          memeConcept: "Un meme avec du texte humoristique généré par GitHub AI",
          humorLevel: 7,
          suggestedHashtags: ["#meme", "#funny", "#github", "#generated"]
        };
      }

      throw new Error(`Erreur GitHub Models: ${error.message}`);
    }
  }
}

module.exports = new GithubAIService();