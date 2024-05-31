import { supabase } from './supabase-config.js';

// Define initial attributes and their ratings with weight for each user
let users = {
    "Zane": {
        age: 30,
        country: "Malaysia",
        attributes: {
            "Health and Fitness (25%)": {
                weight: 0.25,
                items: {
                    "Stamina / 5km Run": 70,
                    "Strength": 80,
                    "Top G Exercise": 75
                }
            },
            "Financial (25%)": {
                weight: 0.25,
                items: {
                    "Money on Hand": 85
                }
            },
            "Discipline (20%)": {
                weight: 0.20,
                items: {
                    "Meditation / Focus": 78,
                    "Charisma / 10s": 82,
                    "Alarm @ 8am": 88
                }
            },
            "Learning and Development (20%)": {
                weight: 0.20,
                items: {
                    "Books Read": 90,
                    "Other Language": 65,
                    "Studying / Pomodoro": 70,
                    "Social Media Following": 50
                }
            },
            "Hobbies and Interests (10%)": {
                weight: 0.10,
                items: {
                    "Chess Rank": 60,
                    "Pickleball/Tennis": 75,
                    "Boxing/MMA": 80
                }
            }
        }
    },
    "Marc": {
        age: 17,
        country: "Malaysia",
        attributes: {
            "Health and Fitness (25%)": {
                weight: 0.25,
                items: {
                    "Stamina / 5km Run": 65,
                    "Strength": 70,
                    "Top G Exercise": 60
                }
            },
            "Financial (25%)": {
                weight: 0.25,
                items: {
                    "Money on Hand": 50
                }
            },
            "Discipline (20%)": {
                weight: 0.20,
                items: {
                    "Meditation / Focus": 60,
                    "Charisma / 10s": 70,
                    "Alarm @ 8am": 75
                }
            },
            "Learning and Development (20%)": {
                weight: 0.20,
                items: {
                    "Books Read": 80,
                    "Other Language": 60,
                    "Studying / Pomodoro": 65,
                    "Social Media Following": 40
                }
            },
            "Hobbies and Interests (10%)": {
                weight: 0.10,
                items: {
                    "Chess Rank": 55,
                    "Pickleball/Tennis": 70,
                    "Boxing/MMA": 65
                }
            }
        }
    }
};

// Load users from Supabase
async function fetchUserData() {
    console.log("Fetching user data for:", currentUser);
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('name', currentUser)
        .single();

    if (error) {
        console.error('Error fetching user data:', error);
    } else {
        console.log("User data:", data);
        users[currentUser] = data;
        displayAttributes(currentUser);
        document.getElementById('overall-score').textContent = calculateOverallScore(currentUser);
    }
}

async function updateUserData() {
    const { error } = await supabase
        .from('users')
        .update({ attributes: users[currentUser].attributes })
        .eq('name', currentUser);

    if (error) {
        console.error('Error updating user data:', error);
    }
}

// Current user
let currentUser = "Zane";

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
        await updateUserData();
        displayAttributes(currentUser);
        document.getElementById('overall-score').textContent = calculateOverallScore(currentUser);
    }
});

// Function to switch user
document.getElementById('user-select').addEventListener('change', function(event) {
    currentUser = event.target.value;
    document.getElementById('user-name').textContent = currentUser;
    document.getElementById('user-age').textContent = users[currentUser].age;
    fetchUserData();
    populateDropdowns();
});

// Function to check password
document.getElementById('password-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const password = document.getElementById('password').value;
    if (password === 'sui') {
        document.getElementById('password-container').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        document.getElementById('user-name').textContent = currentUser;
        document.getElementById('user-age').textContent = users[currentUser].age;
        fetchUserData();
        populateDropdowns();
        document.getElementById('overall-score').textContent = calculateOverallScore(currentUser);
    } else {
        alert('Incorrect password');
    }
});

// Initialize the page
fetchUserData();
