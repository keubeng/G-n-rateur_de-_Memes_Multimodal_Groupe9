# G-n-rateur_de-_Memes_Multimodal_Groupe9
# Générateur de Memes Multimodal — Groupe 9 (ICT202 G2)

## Description
Application mobile permettant de générer des memes humoristiques à partir
de texte, d'audio ou d'image, en s'appuyant sur des API d'intelligence
artificielle (NLP, Speech-to-Text, Computer Vision).

## Stack technique
- **Frontend** : React Native (Expo)
- **Backend** : Node.js / Express.js
- **Upload de fichiers** : Multer
- **IA** : [À COMPLÉTER — nom du service utilisé : OpenAI / Gemini / Hugging Face]

## Fonctionnalités

### Principales (Core)
- Context Reader (analyse de texte)
- Voice-to-Meme (audio → transcription → meme)
- Status Remixer (ajout de texte IA sur une image)

### Bonus
- Share Intent (réception depuis WhatsApp) — [STATUT : À COMPLÉTER]
- Localisation culturelle (expressions camerounaises) — ✅ Implémenté
- Génération d'image par IA — [STATUT : À COMPLÉTER]

## Installation

### Prérequis
- Node.js (version [À COMPLÉTER])
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Un téléphone Android avec l'app Expo Go, ou un émulateur

### Backend
\`\`\`bash
cd backend
npm install
cp .env.example .env
# Renseigner les clés API dans le fichier .env
npm start
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install
npx expo start
\`\`\`
Scanner le QR code avec l'app Expo Go, ou appuyer sur 'a' pour lancer sur émulateur Android.

## Configuration des clés API
Créer un fichier \`.env\` dans le dossier \`/backend\` avec :
\`\`\`
[À COMPLÉTER — exemple :]
OPENAI_API_KEY=ta_cle_ici
PORT=3000
\`\`\`

## Équipe — ICT202 G2, Groupe 9
| Membre | Responsabilité |
|--------|-----------------|
| Membre 1 | Backend Core & Architecture |
| Membre 2 | Backend IA Audio & Image |
| Membre 3 | Frontend Mobile (Texte & Audio) |
| Membre 4 | Frontend Mobile (Image, UI & Navigation) |
| Membre 5 | Bonus, Documentation & Livrables |

## Démonstration vidéo
[À COMPLÉTER — lien Google Drive ou WhatsApp vers la vidéo de démo]
