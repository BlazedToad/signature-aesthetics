/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const cors = require("cors");

// ✅ Restrict API access to your Vercel domain
const corsOptions = {
    origin: ["https://signature-aesthetics.vercel.app/"], // ✅ Replace with your Vercel domain
    methods: "GET",
    allowedHeaders: ["Content-Type"]
};

exports.getFirebaseConfig = functions.https.onRequest((req, res) => {
    cors(corsOptions)(res.json({
        apiKey: functions.config().saeasthetics.api_key,
        authDomain: functions.config().saeasthetics.auth_domain,
        projectId: functions.config().saeasthetics.project_id,
        storageBucket: functions.config().saeasthetics.storage_bucket,
        messagingSenderId: functions.config().saeasthetics.messaging_sender_id,
        appId: functions.config().saeasthetics.app_id,
        adminEmail: functions.config().saeasthetics.admin_email
    }));
});