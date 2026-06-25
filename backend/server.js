// server.js
const app = require('./src/app');
const config = require('./src/config/env');

const PORT = config.port;

console.log('Démarrage du serveur...');
console.log(`Environnement: ${config.nodeEnv}`);

if (!config.githubToken || config.githubToken === 'github_pat_votre_token_ici') {
  console.warn('ATTENTION: Token GitHub non configuré!');
  console.warn('Le service IA fonctionnera en mode démo avec des données mockées.');
  console.warn('Pour activer GitHub Models, mettez votre token dans le fichier .env');
  console.warn('Générer un token: https://github.com/settings/tokens');
} else {
  console.log('Token GitHub trouvé');
  console.log('Service IA: GitHub Models activé');
}

app.listen(PORT, () => {
  console.log('\n=================================');
  console.log('MONSTRE MEME GENERATOR API');
  console.log('=================================');
  console.log(`Serveur: http://localhost:${PORT}`);
  console.log(`Environnement: ${config.nodeEnv}`);
  console.log(`IA Provider: GitHub Models`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Test Context Reader: http://localhost:${PORT}/api/context-reader/test`);
  console.log('=================================\n');
});