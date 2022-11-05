import { applicationDefault, initializeApp } from "firebase-admin/app";
import fbAdmin from "firebase-admin";
const admin = initializeApp({
  credential: fbAdmin.credential.cert(require("/app/serviceAccountKey.json")),
  databaseURL: process.env.dbURL,
});
export default admin;
