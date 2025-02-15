module.exports = (req, res) => {
    const allowedOrigins = [
        "https://signature-aesthetics.vercel.app/",
        "https://signature-aesthetics.vercel.app/admin",
        "https://signature-aesthetics.vercel.app/admin/dashboard.html",
        "http://localhost:3000", // Allow local development
        "http://localhost:5000"  // If using a different local server
    ];

    const origin = req.headers.origin || req.headers.referer;

    if (!allowedOrigins.some((allowed) => origin && origin.startsWith(allowed))) {
        return res.status(403).json({ error: "❌ CORS Not Allowed for this origin." });
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET");

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
};
