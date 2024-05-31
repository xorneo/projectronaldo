import { db } from './firebase-config.js';
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// Define initial attributes and their ratings with weight for each user
let users = {};

// Current user
let currentUser = "Zane";

// Fetch user data from Firestore
async function fetchUserData() {
    const docRef = doc(db, "users", currentUser);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        users[currentUser] = docSnap.data();
        displayAttributes(currentUser);
        document.getElementById('overall-score').textContent = calculateOverallScore(currentUser);
    } else {
        console.log("No such document!");
    }
}

// Function to calculate overall weighted score
function calculateOverallScore(user) {
    const attributes = users[user].attributes;
    let totalScore = 0;
    for (let category in attributes) {
        let categoryScore = 0;
        let itemCount = 0;
        for (let attr in attributes[category].items) {
            categoryScore += attributes[category].items[attr];
            itemCount++;
        }
        categoryScore /= itemCount; // Average score of the category
        totalScore += categoryScore * attributes[category].weight;
    }
    return Math.round(totalScore);
}

// Function to display attributes
function displayAttributes(user) {
    const attributes = users[user].attributes;
    const attributesList = document.getElementById('attributes-list');
    attributesList.innerHTML = '';
    for (let category in attributes) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        const categoryTitle = document.createElement('h4');
        categoryTitle.textContent = category;
        categoryDiv.appendChild(categoryTitle);
        for (let attr in attributes[category].items) {
            const div = document.createElement('div');
            div.className = 'attribute';
            div.innerHTML = `<span>${attr}</span><span>${attributes[category].items[attr]}</span>`;
            categoryDiv.appendChild(div);
        }
        attributesList.appendChild(categoryDiv);
    }
}

// Function to populate dropdowns
function populateDropdowns() {
    const categorySelect = document.getElementById('category');
    const attributeSelect = document.getElementById('attribute');
    
    categorySelect.innerHTML = '';  // Clear existing options
    attributeSelect.innerHTML = '';  // Clear existing options

    for (let category in users[currentUser].attributes) {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    }

    categorySelect.addEventListener('change', function() {
        attributeSelect.innerHTML = '';
        const selectedCategory = categorySelect.value;
        for (let attr in users[currentUser].attributes[selectedCategory].items) {
            const option = document.createElement('option');
            option.value = attr;
            option.textContent = attr;
            attributeSelect.appendChild(option);
        }
    });

    // Trigger change event to populate attribute dropdown initially
    categorySelect.dispatchEvent(new Event('change'));
}

// Function to update attribute
document.getElementById('update-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const category = document.getElementById('category').value;
    const attribute = document.getElementById('attribute').value;
    const newValue = parseInt(document.getElementById('new-value').value, 10);

    if (attribute in users[currentUser].attributes[category].items && !isNaN(newValue) && newValue >= 0 && newValue <= 100) {
        users[currentUser].attributes[category].items[attribute] = newValue;

        const docRef = doc(db, "users", currentUser);
        await updateDoc(docRef, {
            attributes: users[currentUser].attributes
        });

        displayAttributes(currentUser);
        document.getElementById('overall-score').textContent = calculateOverallScore(currentUser);
    }
});

// Function to switch user
document.getElementById('user-select').addEventListener('change', function(event) {
    currentUser = event.target.value;
    fetchUserData();
});

// Function to check password
document.getElementById('password-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const password = document.getElementById('password').value;
    if (password === 'sui') {
        document.getElementById('password-container').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        fetchUserData();
    } else {
        alert('Incorrect password');
    }
});

// Initialize the page
fetchUserData();
