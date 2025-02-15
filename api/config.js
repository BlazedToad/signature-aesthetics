export default function handler(req, res) {
    // ✅ Allow requests only from your frontend domain
    const allowedOrigins = ["https://signature-aesthetics.vercel.app/"];

    const origin = req.headers.origin || req.headers.referer;

    if (!allowedOrigins.includes(origin)) {
        return res.status(403).json({ error: "Forbidden: You are not allowed to access this API." });
    }

    // ✅ Send Firebase Config only to allowed origins
    res.status(200).json({
        firebaseConfig: {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID
        },
        allowedEmail: process.env.ADMIN_EMAIL
    });
}
