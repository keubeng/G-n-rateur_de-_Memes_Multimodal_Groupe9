# Notes — Share Intent

## Installation (à faire une fois frontend/ existe)
npx expo install expo-share-intent

## Config app.json
"plugins": ["expo-share-intent"]

## Build nécessaire (pas Expo Go)
npx expo prebuild
npx expo run:android

## Logique à implémenter
- Récupérer shareIntent.text ou shareIntent.files
- Rediriger vers l'écran Context Reader si texte
- Rediriger vers l'écran Status Remixer si image
