import express from "express";
import admin from "firebase-admin";

const app = express();

// Check Firebase Key
if (!process.env.FIREBASE_KEY) {
  console.error("ERREUR : FIREBASE_KEY non définie !");
  process.exit(1);
}

// Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Middleware pour JSON et fichiers statiques
app.use(express.json());
app.use(express.static("public"));

// API pour déclencher alerte
// POST /alert { "type": "alerte1", "message": "texte" }
app.post("/alert", async (req, res) => {
  const { type, message } = req.body;
  if (!type || !message) return res.status(400).send("type & message required");

  console.log(`Alerte déclenchée: ${type} - ${message}`);
  
  // TODO: envoyer notification Firebase à tous les appareils
  // Exemple : admin.messaging().sendToDevice([...tokens], {...})
  
  res.send("Alerte envoyée !");
});

// Port dynamique Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
