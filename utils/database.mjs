import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Inicializa firebase-admin solo si no está ya inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.storageBucket,
  });
}

const db = admin.firestore();  // Base de datos Firestore
const bucket = admin.storage().bucket(); // Bucket de Storage

export { admin, db, bucket };