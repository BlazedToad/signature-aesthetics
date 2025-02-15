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
        const iconsResponse = await fetch("../content/icons.json");
        const icons = await iconsResponse.json(); // Load available icons

        snapshot.forEach(doc => {
            listContainer.appendChild(createTreatmentCard(doc.id, doc.data(), icons));
        });
    } catch (error) {
        console.error("❌ Error loading treatments:", error);
    }
}

// ✅ Create Treatment Card (Includes Icon Dropdown)
function createTreatmentCard(id, data, icons) {
    const card = document.createElement("div");
    card.classList.add("item-card");

    // Generate icon dropdown options
    let iconOptions = icons.map(icon => 
        `<option value="${icon.icon}" ${data.icon === icon.icon ? "selected" : ""}>
            ${icon.name}
        </option>`
    ).join("");

    // Determine correct preview display
    let iconPreview = "";
    if (data.icon) {
        if (data.icon.includes("fa-")) {
            iconPreview = `<i class="${data.icon}"></i>`;
        } else if (data.icon.endsWith(".png") || data.icon.endsWith(".svg")) {
            iconPreview = `<img src="${window.location.origin}${data.icon}" class="svg-icon">`;
        }
    }

    card.innerHTML = `

        <div class="icon-preview" id="icon-preview-${id}">
            ${iconPreview}
        </div>

        <label for="icon-${id}">Select an Icon:</label>
        <select id="icon-${id}">
            ${iconOptions}
        </select>

        <label for="name-${id}">Name of treatment:</label>
        <input type="text" id="name-${id}" value="${data.name}" placeholder="Treatment Name">
        
        <label for="description-${id}">Description:</label>
        <input type="text" id="description-${id}" value="${data.description}" placeholder="Description">

        <label for="price-${id}">Cost of treatment:</label>
        <input type="text" id="price-${id}" value="${data.price}" placeholder="Price">

        <div class="buttons">
            <button class="save-btn" onclick="saveTreatment('${id}')">💾 Save</button>
            <button class="delete-btn" onclick="deleteTreatment('${id}')">🗑️ Delete</button>
        </div>
    `;

    // ✅ Event Listener to Update Preview on Selection Change
    card.querySelector(`#icon-${id}`).addEventListener("change", (event) => {
        let selectedIcon = event.target.value;
        let previewDiv = document.getElementById(`icon-preview-${id}`);

        if (selectedIcon.includes("fa-")) {
            previewDiv.innerHTML = `<i class="${selectedIcon}"></i>`;
        } else if (selectedIcon.endsWith(".png") || selectedIcon.endsWith(".svg")) {
            previewDiv.innerHTML = `<img src="${window.location.origin}${selectedIcon}" class="svg-icon">`;
        }
    });

    return card;
}


// ✅ Add a New Treatment
export async function addTreatment() {
    try {
        await addDoc(collection(db, "treatments"), {
            name: "New Treatment",
            description: "Enter description",
            price: "£0.00",
            icon: "" // Default empty icon field
        });
        loadTreatmentsAdmin();
    } catch (error) {
        console.error("❌ Error adding treatment:", error);
    }
}

// ✅ Save a Treatment (Includes Icon Selection)
export async function saveTreatment(id) {
    const name = document.getElementById(`name-${id}`).value;
    const description = document.getElementById(`description-${id}`).value;
    const price = document.getElementById(`price-${id}`).value;
    const icon = document.getElementById(`icon-${id}`).value; // ✅ Capture selected icon

    try {
        await updateDoc(doc(db, "treatments", id), { name, description, price, icon });
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
