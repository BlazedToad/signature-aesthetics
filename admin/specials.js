import { db } from "../scripts.js";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// ✅ Load Specials into Cards
export async function loadSpecials() {
    const specialsContainer = document.getElementById("specialsContainer");
    if (!specialsContainer) return console.error("❌ specialsContainer not found!");

    specialsContainer.innerHTML = ""; // Clear the container

    // Ensure there's a list-container inside specialsContainer
    let listContainer = document.createElement("div");
    listContainer.classList.add("list-container");
    specialsContainer.appendChild(listContainer);

    try {
        const querySnapshot = await getDocs(collection(db, "specials"));
        querySnapshot.forEach(doc => {
            const special = doc.data();
            listContainer.appendChild(createSpecialCard(doc.id, special));
        });
    } catch (error) {
        console.error("❌ Error loading specials:", error);
    }
}

// ✅ Create Special Card Component
function createSpecialCard(id, special) {
    const card = document.createElement("div");
    card.classList.add("item-card");

    card.innerHTML = `
        <input type="text" id="title-${id}" value="${special.title}" placeholder="Title">
        <input type="text" id="description-${id}" value="${special.description}" placeholder="Description">
        <input type="text" id="price-${id}" value="${special.price}" placeholder="Price">
        <div class="buttons">
            <button class="save-btn" onclick="saveSpecial('${id}')">💾 Save</button>
            <button class="delete-btn" onclick="deleteSpecial('${id}')">🗑️ Delete</button>
        </div>
    `;
    return card;
}

// ✅ Add a New Special
export async function addSpecial() {
    try {
        await addDoc(collection(db, "specials"), {
            title: "New Special",
            description: "Enter description",
            price: "£0.00"
        });
        loadSpecials();
    } catch (error) {
        console.error("❌ Error adding special:", error);
    }
}

// ✅ Save a Special
export async function saveSpecial(id) {
    const title = document.getElementById(`title-${id}`).value;
    const description = document.getElementById(`description-${id}`).value;
    const price = document.getElementById(`price-${id}`).value;

    try {
        await updateDoc(doc(db, "specials", id), { title, description, price });
        console.log(`✅ Successfully updated special: ${id}`);
    } catch (error) {
        console.error("❌ Error updating special:", error);
    }
}

// ✅ Delete a Special
export async function deleteSpecial(id) {
    try {
        await deleteDoc(doc(db, "specials", id));
        loadSpecials();
    } catch (error) {
        console.error("❌ Error deleting special:", error);
    }
}

// ✅ Attach Functions
window.saveSpecial = saveSpecial;
window.deleteSpecial = deleteSpecial;
