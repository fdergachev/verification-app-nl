require('dotenv').config();
var admin = require("firebase-admin");
const { initializeApp } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');

var serviceAccount = JSON.parse(process.env.DATABASE_CONFIG);

admin.initializeApp({
   credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();


const institutions = db.collection('institutions');
const owners = db.collection('owners');

module.exports = { db, auth, institutions, owners };