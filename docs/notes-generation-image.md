# Notes — Génération d'image par IA (bonus optionnel)

## Options possibles
- OpenAI DALL-E API (nécessite clé API + crédits)
- Stability AI (Stable Diffusion)
- Hugging Face Inference API (modèles gratuits, plus lent)

## Décision
[À discuter avec le groupe selon le temps restant]

## Si implémenté : endpoint suggéré
POST /generate-image
Body: { prompt: string }
Réponse: { imageUrl: string }
