import admin from "firebase-admin";

import serviceAccount from "./config/firebaseServiceAccountKey.js";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tech-store-8bfb7.firebaseio.com",
});

export default admin;
