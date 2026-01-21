import express from "express";
import admin from "firebase-admin";

const app = express();
app.use(express.json()); // Pour POST JSON

// Vérifie que la variable FIREBASE_KEY est définie
if (!process.env.FIREBASE_KEY) {
  console.error("ERREUR : FIREBASE_KEY non définie !");
  process.exit(1);
}

// Initialise Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Liste des tokens Android avec leur zone
const tokenZones = [
  { token: "TOKEN_ANDROID_1", zone: "75-Paris" },
  { token: "TOKEN_ANDROID_2", zone: "13-Marseille" }
];

// Liste des 60 alertes FR-Alerte
const alertTypes = [
  "Tempête","Orage","Inondation","Tornade","Vigilance jaune","Vigilance orange",
  "Vigilance rouge","Avalanche","Canicule","Froid intense","Neige verglas","Cyclone",
  "Éruption volcanique","Séisme","Tsunami","Tremblement de terre","Radiation","Pollution",
  "Incendie forêt","Risque nucléaire","Chute de météorite","Épidémie","Confinement","Attentat",
  "Panne électrique","Transport fermé","Inondation urbaine","Glissement de terrain","Crue",
  "Avalanche locale","Orages violents","Cyclone tropical","Canicule extrême","Tempête de neige",
  "Vague-submersion","Forte houle","Risque chimique","Risque biologique","Accident industriel",
  "Éboulement","Crue majeure","Sécheresse","Tremblement mineur","Alerte nucléaire","Tempête de sable",
  "Tornade locale","Éruption mineure","Inondation côtière","Glace sur route","Forte pluie","Vent violent",
  "Orages isolés","Avalanche zone","Crue flash","Tsunami local","Panne réseau","Incendie urbain"
];

// API pour déclencher une alerte
// POST /alert { "type": 1-60, "zone": "75-Paris", "message": "Texte message" }
app.post("/alert", async (req, res) => {
  const { type, zone, message } = req.body;
  if (!type || !zone || !message) return res.status(400).send("type, zone & message requis");

  const alertName = alertTypes[type-1] || "Alerte inconnue";

  // Filtrer tokens selon zone
  const tokens = tokenZones.filter(t => t.zone === zone).map(t => t.token);
  if (tokens.length === 0) return res.status(404).send("Aucun appareil dans cette zone");

  // Envoyer notification FCM
  try {
    const response = await admin.messaging().sendMulticast({
      notification: {
        title: `ALERTE : ${alertName}`,
        body: message
      },
      tokens
    });
    console.log(`Alerte "${alertName}" envoyée à ${tokens.length} appareil(s)`);
    res.send(`Alerte "${alertName}" envoyée !`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur Firebase");
  }
});

// Port dynamique Railway ou 3000 local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
