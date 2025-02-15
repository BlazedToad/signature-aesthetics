const isLocal = window.location.hostname === "localhost";

// ✅ Function to Load Config Dynamically
export const loadConfig = async () => {
    let firebaseConfig = {};
    let allowedEmails = [];  // Initialize as an empty array

    if (isLocal) {
        try {
            const response = await fetch("/config.json");
            if (!response.ok) throw new Error("Failed to fetch config.json");
            const config = await response.json();

            // Retrieve allowed emails from the environment variables
            allowedEmails = [
                config.ADMIN_EMAIL,  // Add the admin email
                config.USER_EMAIL    // Add the second user email
            ];

            firebaseConfig = {
                apiKey: config.FIREBASE_API_KEY,
                authDomain: config.FIREBASE_AUTH_DOMAIN,
                projectId: config.FIREBASE_PROJECT_ID,
                storageBucket: config.FIREBASE_STORAGE_BUCKET,
                messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
                appId: config.FIREBASE_APP_ID
            };
            allowedEmails = allowedEmails;  // Fallback to an empty array
            console.log("✅ Loaded local Firebase config:", firebaseConfig);
            console.log("✅ Loaded allowed emails:", allowedEmails);
        } catch (error) {
            console.error("❌ Error loading local config.json:", error);
        }
    } else {
        try {
            console.log("🔍 Fetching Firebase config...");

            // ✅ Fetch Firebase Config from Vercel API route
            const response = await fetch("/api/config");
            if (!response.ok) throw new Error("Failed to fetch Firebase config");

            const config = await response.json();

            firebaseConfig = {
                apiKey: config.firebaseConfig.apiKey,
                authDomain: config.firebaseConfig.authDomain,
                projectId: config.firebaseConfig.projectId,
                storageBucket: config.firebaseConfig.storageBucket,
                messagingSenderId: config.firebaseConfig.messagingSenderId,
                appId: config.firebaseConfig.appId
            };

            // Deserialize allowedEmails from environment variable in Vercel
           allowedEmails = config.allowedEmails;  // Default to an empty array if undefined
        } catch (error) {
            console.error("❌ Error loading Firebase config:", error);
        }
    }

    return { firebaseConfig, allowedEmails };
};
