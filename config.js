const isLocal = window.location.hostname === "localhost";

// ✅ Function to Load Config Dynamically
export const loadConfig = async () => {
    let firebaseConfig = {};
    let allowedEmail = "";

    if (isLocal) {
        try {
            const response = await fetch("/config.json");
            if (!response.ok) throw new Error("Failed to fetch config.json");
            const config = await response.json();
            
            firebaseConfig = {
                apiKey: config.FIREBASE_API_KEY,
                authDomain: config.FIREBASE_AUTH_DOMAIN,
                projectId: config.FIREBASE_PROJECT_ID,
                storageBucket: config.FIREBASE_STORAGE_BUCKET,
                messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
                appId: config.FIREBASE_APP_ID
            };
            allowedEmail = config.ADMIN_EMAIL;
            console.log("✅ Loaded local Firebase config:", firebaseConfig);
        } catch (error) {
            console.error("❌ Error loading local config.json:", error);
        }
    } else {
        // ✅ Production: Load from Environment Variables (Vercel)
        firebaseConfig = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID
        };
        allowedEmail = process.env.ADMIN_EMAIL;
        console.log("✅ Loaded Vercel Firebase config.");
    }

    return { firebaseConfig, allowedEmail };
};
