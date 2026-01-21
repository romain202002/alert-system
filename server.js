const admin = require('firebase-admin');
const serviceAccount = require('./firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Token FCM récupéré depuis le téléphone (PWA)
const token = "TON_TOKEN_FCM";

const alerts = [
  {title: "Tempête", body: "Niveau 1"},
  {title: "Orage", body: "Violent"},
  {title: "Inondation", body: "Attention"},
  // ... jusqu'à 60 alertes
];

// Exemple : envoyer la première alerte
const message = {
  notification: alerts[0],
  token: token
};

admin.messaging().send(message)
  .then(response => console.log("Alerte envoyée :", response))
  .catch(error => console.error("Erreur :", error));
