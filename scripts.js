// ✅ Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-storage.js";
import { loadConfig } from "../config.js"; // ✅ Load Firebase config dynamically

// ✅ Firebase Variables
export let app;
export let auth;
export let db;
export let provider;
export let storage; // 🔥 Add Storage

// ✅ Initialize Firebase AFTER Config is Loaded
export async function initializeFirebase() {
    try {
        const { firebaseConfig, allowedEmail } = await loadConfig();

        // ✅ Initialize Firebase
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        provider = new GoogleAuthProvider();
        db = getFirestore(app); // ✅ Firestore initialized AFTER Firebase
        storage = getStorage(app);

        console.log("✅ Firebase Initialized Successfully!");
        console.log("🔥 Firebase Storage Bucket:", storage._bucket || "Bucket not found");
        return { auth, db, provider, allowedEmail };

    } catch (error) {
        console.error("❌ Failed to load Firebase Config:", error);
    }
}

// ✅ Login Function
export async function loginWithGoogle() {
    try {
        const { allowedEmail } = await initializeFirebase();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        if (user.email === allowedEmail) {
            console.log("✅ Logged in as:", user.email);
            window.location.href = "/admin/dashboard.html"; // ✅ Redirect to dashboard
        } else {
            console.error("❌ Unauthorized user:", user.email);
            alert("Access Denied: You are not authorized to log in.");
            await signOut(auth);
            window.location.href = "index.html"; // ✅ Redirect to login page
        }
    } catch (error) {
        console.error("❌ Login error:", error.message);
    }
}

// ✅ Logout Function
export async function logout() {
    try {
        await signOut(auth);
        console.log("✅ Logged out");
        window.location.href = "/admin/index.html"; // ✅ Redirect to login page
    } catch (error) {
        console.error("❌ Logout error:", error.message);
    }
}

// ✅ Check if the Admin is Authenticated
export async function checkAuth() {
    const { auth } = await initializeFirebase();
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("✅ User authenticated:", user.email);
                resolve(user);
            } else {
                console.error("❌ Unauthorized access attempt.");
                window.location.href = "/admin/index.html"; // Redirect to login page
                reject();
            }
        });
    });
}

// ✅ Ensure Data Only Loads on Public Pages (Index Page)
document.addEventListener("DOMContentLoaded", async () => {
    await initializeFirebase();

    // ✅ Only Load Specials, Treatments, and Testimonials if the elements exist
    if (document.getElementById("specials-container")) {
        loadSpecials();
    }
    if (document.getElementById("treatments-container")) {
        loadTreatments();
    }
    if (document.getElementById("testimonial-container")) {
        loadTestimonials();
    }
});
// ✅ Load Specials from Firestore
async function loadSpecials() {
    if (!db) return console.error("❌ Firestore not initialized yet!");
    const specialsContainer = document.getElementById("specials-container");
    specialsContainer.innerHTML = "";

    try {
        const querySnapshot = await getDocs(collection(db, "specials"));
        querySnapshot.forEach(doc => {
            const special = doc.data();

            const specialItem = document.createElement("div");
            specialItem.classList.add("special-item");

            specialItem.innerHTML = `
                <h3>${special.title}</h3>
                <p>${special.description}</p>
                <span class="special-price">${special.price}</span>
            `;

            specialsContainer.appendChild(specialItem);
        });
    } catch (error) {
        console.error("❌ Error loading specials:", error);
    }
}

// ✅ Load Treatments from Firestore
async function loadTreatments() {
    if (!db) return console.error("❌ Firestore not initialized yet!");
    const treatmentsContainer = document.getElementById("treatments-container");
    treatmentsContainer.innerHTML = "";

    try {
        const querySnapshot = await getDocs(collection(db, "treatments"));
        querySnapshot.forEach(doc => {
            const treatment = doc.data();

            const treatmentCard = document.createElement("div");
            treatmentCard.classList.add("service-card");

            treatmentCard.innerHTML = `
                <i class="fa-solid ${treatment.icon} treatment-icon"></i>
                <h3>${treatment.name}</h3>
                <p>${treatment.description}</p>
                <strong>${treatment.price}</strong>
            `;

            treatmentsContainer.appendChild(treatmentCard);
        });
    } catch (error) {
        console.error("❌ Error loading treatments:", error);
    }
}

// ✅ Load Testimonials from Firestore
async function loadTestimonials() {
    if (!db) return console.error("❌ Firestore not initialized yet!");
    const testimonialContainer = document.getElementById("testimonial-container");
    testimonialContainer.innerHTML = "";

    try {
        const querySnapshot = await getDocs(collection(db, "testimonials"));
        querySnapshot.forEach(doc => {
            const testimonial = doc.data();

            const testimonialSlide = document.createElement("div");
            testimonialSlide.classList.add("swiper-slide");

            testimonialSlide.innerHTML = `
                <div class="testimonial">
                    <img src="${testimonial.image}" alt="${testimonial.name}'s testimonial">
                    <p>"${testimonial.text}"</p>
                    <strong class="client-name">- ${testimonial.name}</strong>
                </div>
            `;

            testimonialContainer.appendChild(testimonialSlide);
        });

        // ✅ Initialize Swiper After Content Loads
        new Swiper('.testimonial-carousel', {
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    } catch (error) {
        console.error("❌ Error loading testimonials:", error);
    }
}
