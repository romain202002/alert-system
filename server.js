import express from "express";
import admin from "firebase-admin";

const app = express();

// Firebase via variable d'environnement
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Servir le dossier "public"
app.use(express.static("public"));

// Port dynamique pour Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
