// src/services/aiService.js
const OpenAI = require('openai');
const config = require('../config/env');

class AIService {
  constructor() {
    // Initialisation du client Open AI
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
    });
  }

  /**
   * Analyse et génère un meme à partir d'un texte
   * @param {string} text - Le texte à analyser
   * @param {string} culture - Culture pour la localisation (ex: 'camerouon')
   * @returns {Promise<Object>} - La réponse de l'IA
   */
  async generateMemeFromText(text, culture = 'standard') {
    try {
      // Construction du prompt avec localisation culturelle
      let culturalContext = '';
      if (culture === 'cameroun') {
        culturalContext = `Utilise des références, expressions et humour camerounais. 
          Sois créatif avec des punchlines à la camerounaise.
          Références possibles : le ndolé, le poisson braisé, le moto-taxi, 
          les embouteillages à Yaoundé/Douala, les "worman", etc.`;
      }

      const prompt = `Tu es un expert en génération de memes humoristiques.
        Analyse le texte suivant et génère une punchline ou un concept de meme hilarant.
        
        Texte: "${text}"
        
        ${culturalContext}
        
        Réponds au format JSON suivant:
        {
          "originalText": "${text}",
          "punchline": "la punchline générée",
          "memeConcept": "description du visuel suggéré",
          "humorLevel": 1-10,
          "suggestedHashtags": ["#tag1", "#tag2"]
        }`;

      console.log('Envoi de la requête à OpenAI...');

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Tu es un générateur de memes professionnel.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 300,
      });

      console.log('Réponse reçue d\'OpenAI');

      // Parser la réponse JSON
      const result = JSON.parse(response.choices[0].message.content);
      return result;
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API IA:', error.message);
      
      // En cas d'erreur, retourner un résultat mocké pour le développement
      if (config.nodeEnv === 'development') {
        console.log('Utilisation des données mockées (mode développement)');
        return {
          originalText: text,
          punchline: `"${text}" - Punchline générée par IA (mode démo)`,
          memeConcept: "Un meme avec du texte humoristique",
          humorLevel: 7,
          suggestedHashtags: ["#meme", "#funny", "#generated"]
        };
      }
      
      throw new Error(`Erreur API IA: ${error.message}`);
    }
  }
}

module.exports = new AIService();
