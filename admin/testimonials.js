import { auth, db, storage } from "../scripts.js";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-storage.js";

// ✅ Ensure Firestore is properly initialized before calling functions
async function ensureFirestoreInitialized() {
    return new Promise((resolve) => {
        const checkDb = setInterval(() => {
            if (db) {
                clearInterval(checkDb);
                resolve();
            }
        }, 100);
    });
}

// ✅ Load Testimonials into Cards (Ensuring Row Layout)
export async function loadTestimonialsAdmin() {
    await ensureFirestoreInitialized();
    const container = document.getElementById("testimonialsContainer");
    if (!container) return console.error("❌ Container not found!");

    container.innerHTML = ""; // Clear container

    // Ensure there's a list-container inside testimonialsContainer
    let listContainer = document.createElement("div");
    listContainer.classList.add("list-container");
    container.appendChild(listContainer);

    try {
        const snapshot = await getDocs(collection(db, "testimonials"));
        if (snapshot.empty) {
            console.warn("⚠️ No testimonials found in the database.");
        } else {
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data) {
                    listContainer.appendChild(createTestimonialCard(doc.id, data));
                }
            });
        }
    } catch (error) {
        console.error("❌ Error loading testimonials:", error);
    }
}

// ✅ Ensure Testimonials Load on Page Load
window.addEventListener("load", async () => {
    await loadTestimonialsAdmin();
});

// ✅ Create Testimonial Card
function createTestimonialCard(id, data) {
    const card = document.createElement("div");
    card.classList.add("item-card");

    const imageSrc = data.image && data.image !== "" ? data.image : "https://placehold.co/150x150?text=Click+to+Upload";
    const imageText = data.image && data.image !== "" ? "Click to change image" : "Click to upload image";

    card.innerHTML = `
        <div class="image-upload" onclick="document.getElementById('file-${id}').click()">
            <img src="${imageSrc}" class="testimonial-img" id="img-${id}">
            <p>${imageText}</p>
        </div>
        <input type="file" id="file-${id}" hidden accept="image/*" onchange="uploadTestimonialImage('${id}')">
        <input type="text" id="name-${id}" value="${data.name ? data.name : ""}" placeholder="Name">
        <input type="text" id="text-${id}" value="${data.text ? data.text : ""}" placeholder="Testimonial text">
        <div class="buttons">
            <button class="save-btn" onclick="saveTestimonial('${id}')">💾 Save</button>
            <button class="delete-btn" onclick="deleteTestimonial('${id}', '${data.image ? data.image : ''}')">🗑️ Delete</button>
        </div>
        <p id="status-${id}" class="status-message"></p>
    `;
    return card;
}

// ✅ Add New Testimonial
export async function addTestimonial() {
    await ensureFirestoreInitialized();
    try {
        await addDoc(collection(db, "testimonials"), {
            name: "",
            text: "",
            image: ""
        });
        loadTestimonialsAdmin();
    } catch (error) {
        console.error("❌ Error adding testimonial:", error);
    }
}

// ✅ Upload and Save Testimonial
async function saveTestimonial(id) {
    await ensureFirestoreInitialized();
    const name = document.getElementById(`name-${id}`).value;
    const text = document.getElementById(`text-${id}`).value;
    const fileInput = document.getElementById(`file-${id}`);
    const status = document.getElementById(`status-${id}`);

    let imageUrl = document.getElementById(`img-${id}`).src;
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const storageRef = ref(storage, `testimonials/${id}/${file.name}`);
        const uploadTask = await uploadBytesResumable(storageRef, file);
        imageUrl = await getDownloadURL(uploadTask.ref);
    }

    try {
        await updateDoc(doc(db, "testimonials", id), { name, text, image: imageUrl });
        document.getElementById(`img-${id}`).src = imageUrl;
        status.textContent = "✅ Successfully saved!";
        setTimeout(() => { status.textContent = ""; }, 2000);
    } catch (error) {
        status.textContent = "❌ Error saving!";
        console.error("❌ Error updating testimonial:", error);
    }
}

// ✅ Delete Testimonial
async function deleteTestimonial(id, imageUrl) {
    await ensureFirestoreInitialized();
    try {
        if (imageUrl) {
            const imageRef = ref(storage, imageUrl);
            deleteObject(imageRef).catch(error => console.warn("❌ Failed to delete image, but continuing with database deletion", error));
        }
        await deleteDoc(doc(db, "testimonials", id));
        loadTestimonialsAdmin();
    } catch (error) {
        console.error("❌ Error deleting testimonial:", error);
    }
}

window.uploadTestimonialImage = saveTestimonial;
window.saveTestimonial = saveTestimonial;
window.deleteTestimonial = deleteTestimonial;
window.addTestimonial = addTestimonial;
