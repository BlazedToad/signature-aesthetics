import { db } from "../scripts.js";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// ✅ Load Treatments into Cards
export async function loadTreatmentsAdmin() {
    const container = document.getElementById("treatmentsContainer");
    if (!container) return console.error("❌ Container not found!");

    container.innerHTML = ""; // Clear the container

    // Ensure there's a list-container inside treatmentsContainer
    let listContainer = document.createElement("div");
    listContainer.classList.add("list-container");
    container.appendChild(listContainer);

    try {
        const snapshot = await getDocs(collection(db, "treatments"));
        snapshot.forEach(doc => {
            listContainer.appendChild(createTreatmentCard(doc.id, doc.data()));
        });
    } catch (error) {
        console.error("❌ Error loading treatments:", error);
    }
}

// ✅ Create Treatment Card
function createTreatmentCard(id, data) {
    const card = document.createElement("div");
    card.classList.add("item-card");

    card.innerHTML = `
        <input type="text" id="name-${id}" value="${data.name}" placeholder="Treatment Name">
        <input type="text" id="description-${id}" value="${data.description}" placeholder="Description">
        <input type="text" id="price-${id}" value="${data.price}" placeholder="Price">
        <div class="buttons">
            <button class="save-btn" onclick="saveTreatment('${id}')">💾 Save</button>
            <button class="delete-btn" onclick="deleteTreatment('${id}')">🗑️ Delete</button>
        </div>
    `;
    return card;
}

// ✅ Add a New Treatment
export async function addTreatment() {
    try {
        await addDoc(collection(db, "treatments"), {
            name: "New Treatment",
            description: "Enter description",
            price: "£0.00"
        });
        loadTreatmentsAdmin();
    } catch (error) {
        console.error("❌ Error adding treatment:", error);
    }
}

// ✅ Save a Treatment
export async function saveTreatment(id) {
    const name = document.getElementById(`name-${id}`).value;
    const description = document.getElementById(`description-${id}`).value;
    const price = document.getElementById(`price-${id}`).value;

    try {
        await updateDoc(doc(db, "treatments", id), { name, description, price });
        console.log(`✅ Successfully updated treatment: ${id}`);
    } catch (error) {
        console.error("❌ Error updating treatment:", error);
    }
}

// ✅ Delete a Treatment
export async function deleteTreatment(id) {
    try {
        await deleteDoc(doc(db, "treatments", id));
        loadTreatmentsAdmin();
    } catch (error) {
        console.error("❌ Error deleting treatment:", error);
    }
}

// ✅ Attach Functions to Window
window.saveTreatment = saveTreatment;
window.deleteTreatment = deleteTreatment;
