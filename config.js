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
        try {
            console.log("🔍 Fetching Firebase config from Cloud Function...");

        // ✅ Use the new Firebase v2 function URL
        const response = await fetch("https://getfirebaseconfig-omsptzezxa-uc.a.run.app");

        if (!response.ok) throw new Error("Failed to fetch Firebase config");

        const config = await response.json();

        const firebaseConfig = {
            apiKey: config.apiKey,
            authDomain: config.authDomain,
            projectId: config.projectId,
            storageBucket: config.storageBucket,
            messagingSenderId: config.messagingSenderId,
            appId: config.appId
        };

        console.log("✅ Loaded Firebase config securely:", firebaseConfig);
        return { firebaseConfig };
        } catch (error) {
            console.error("❌ Error loading Firebase config:", error);
        }
    }

    return { firebaseConfig, allowedEmail };
};
