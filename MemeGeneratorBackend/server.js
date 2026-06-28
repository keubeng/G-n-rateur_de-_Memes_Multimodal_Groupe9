require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('API Générateur de Memes - OK'));

app.use('/api/context-reader', require('./routes/contextReader'));
app.use('/api/voice-to-meme', require('./routes/voiceToMeme'));
app.use('/api/status-remixer', require('./routes/statusRemixer'));
app.use('/api/generate-image', require('./routes/generateImage'));

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Serveur lancé sur le port ${process.env.PORT}`);
});