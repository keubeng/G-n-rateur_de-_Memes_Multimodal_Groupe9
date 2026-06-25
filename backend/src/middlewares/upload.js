// src/middlewares/upload.js
const multer = require('multer');
const config = require('../config/env');

// Configuration du stockage (mémoire pour les fichiers avant traitement)
const storage = multer.memoryStorage();

// Filtre des types de fichiers
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 
    'image/png', 
    'image/gif',
    'audio/mpeg', 
    'audio/wav', 
    'audio/ogg',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Type de fichier non supporté: ${file.mimetype}`), false);
  }
};

// Configuration Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.maxFileSize,
  },
  fileFilter: fileFilter,
});

// Middleware personnalisé pour gérer les erreurs Multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(413).json({ 
        error: 'Fichier trop volumineux. Taille maximale: 5MB' 
      });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

module.exports = { upload, handleUploadError };
