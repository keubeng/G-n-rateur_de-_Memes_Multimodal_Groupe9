# Monstre Meme Generator - Backend API

> API backend pour le projet de génération de memes - ICT202 G2

## Table des matières

* [État d'avancement](#état-davancement)
* [Fonctionnalités implémentées](#fonctionnalités-implémentées)
* [Fonctionnalités à implémenter](#fonctionnalités-à-implémenter)
* [Installation](#installation)
* [Configuration](#configuration)
* [Endpoints disponibles](#endpoints-disponibles)
* [Structure du projet](#structure-du-projet)
* [Tests avec Postman](#tests-avec-postman)
* [Contact](#contact)

---

## État d'avancement

| Composant                 | Statut        | Responsable   |
| ------------------------- | ------------- | ------------- |
| Structure du projet       | COMPLET       | Membre 1      |
| Setup Express.js          | COMPLET       | Membre 1      |
| Variables d'environnement | COMPLET       | Membre 1      |
| Configuration Multer      | COMPLET       | Membre 1      |
| Context Reader Endpoint   | COMPLET       | Membre 1      |
| Intégration GitHub Models | COMPLET       | Membre 1      |
| Voice-to-Meme Endpoint    | À IMPLÉMENTER | Membre 2      |
| Status Remixer Endpoint   | À IMPLÉMENTER | Membre 2      |
| Tests Frontend            | EN ATTENTE    | Membres 3 & 4 |
| Documentation             | EN COURS      | Membre 5      |

---

## Fonctionnalités implémentées

### 1. Serveur Express.js

* Configuration complète avec `express`, `cors`, `helmet`, `morgan`
* Gestion des erreurs globales
* Routes structurées
* Middlewares de sécurité

### 2. Configuration Multer

* Upload de fichiers avec validation des types (images, audio)
* Gestion des limites de taille (5MB max)
* Stockage en mémoire pour traitement ultérieur
* Gestion des erreurs d'upload

### 3. Sécurisation des clés API

* Variables d'environnement avec fichier `.env`
* Validation des variables requises au démarrage
* Intégration avec GitHub Models (gratuit)

### 4. Endpoint Context Reader

* **POST** `/api/context-reader`
* Reçoit du texte en entrée
* Appelle l'IA (GitHub Models) pour générer une punchline
* Support de la localisation culturelle camerounaise
* Validation des données (texte requis, taille max 1000 caractères)
* Réponse JSON structurée avec métadonnées

**Exemple de réponse :**

```json
{
  "success": true,
  "data": {
    "originalText": "Je suis trop fatigué ce matin",
    "punchline": "Avec le ndolé et le poisson braisé d'hier, même le moto-taxi me semble une montagne à gravir !",
    "memeConcept": "Un personnage assis sur un banc, la tête entre les mains...",
    "humorLevel": 8,
    "suggestedHashtags": ["#FatiguéMaisStylé", "#YaoundéVibes"]
  },
  "metadata": {
    "timestamp": "2026-06-25T08:24:27.364Z",
    "textLength": 29,
    "culture": "cameroon",
    "provider": "github-models",
    "version": "1.0.0"
  }
}
```
