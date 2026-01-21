import express from "express";
import bodyParser from "body-parser";
import admin from "firebase-admin";
import fs from "fs";

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

const serviceAccount = JSON.parse(fs.readFileSync("firebase-key.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let devices = [];
let currentZone = null;

app.post("/register", (req,res)=>{
  devices.push(req.body);
  res.send("OK");
});

app.post("/zone", (req,res)=>{
  currentZone = req.body;
  res.send("Zone définie");
});

app.post("/alert", async (req,res)=>{
  const alert = req.body;
  const now = new Date().toLocaleString();

  for(let d of devices){
    if(!currentZone) continue;
    const dist = Math.sqrt(
      Math.pow(d.lat-currentZone.lat,2) +
      Math.pow(d.lon-currentZone.lon,2)
    );

    if(dist < currentZone.radius){
      await admin.messaging().send({
        token: d.token,
        notification:{
          title: alert.title,
          body: alert.message + "\n" + now
        }
      });
    }
  }
  res.send("Alerte envoyée");
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Serveur actif sur toutes les IP, port 3000");
});

