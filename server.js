import express from "express";
import admin from "firebase-admin";

const app = express();

// Vérifie la variable d'environnement
if (!process.env.FIREBASE_KEY) {
  console.error("ERREUR : FIREBASE_KEY non définie !");
  process.exit(1);
}

// Initialisation Firebase
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Servir les fichiers statiques dans "public"
app.use(express.static("public"));

// Port dynamique pour Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
