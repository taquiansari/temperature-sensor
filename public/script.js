import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Firebase configuration (replace with your config from Step 2)
const firebaseConfig = {

    apiKey: "AIzaSyDvW6qIV3bmEW1Am8cfbnxQ3GeRG32bSzs",
  
    authDomain: "temp-sensor-cc163.firebaseapp.com",
  
    databaseURL: "https://temp-sensor-cc163-default-rtdb.firebaseio.com",
  
    projectId: "temp-sensor-cc163",
  
    storageBucket: "temp-sensor-cc163.firebasestorage.app",
  
    messagingSenderId: "1054736172986",
  
    appId: "1:1054736172986:web:bab38a1ede68a8fa7ebf83"
  
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const tempDisplay = document.getElementById("temperature-display");
const sliderContainer = document.getElementById("slider-container");
const tempSlider = document.getElementById("temp-slider");
const sliderValue = document.getElementById("slider-value");

// Update temperature display function
function updateDisplay(temperature) {
  const temp = parseFloat(temperature).toFixed(1);
  const [whole, decimal] = temp.split(".");
  tempDisplay.innerHTML = `${whole}<span>.${decimal}</span><strong>&deg;</strong>`;
}

// Check if admin
const isAdmin = new URLSearchParams(window.location.search).get("admin") === "true";
if (isAdmin) {
  sliderContainer.style.display = "block";

  tempSlider.addEventListener("input", async (e) => {
    const newTemp = e.target.value;
    sliderValue.textContent = `${newTemp}°C`;
    updateDisplay(newTemp);

    // Update temperature in Firebase Realtime Database
    try {
      await set(ref(db, "temperature"), { value: newTemp });
    } catch (error) {
      console.error("Error updating temperature:", error);
    }
  });
}

// Listen for real-time updates
const tempRef = ref(db, "temperature");
onValue(tempRef, (snapshot) => {
  const data = snapshot.val();
  if (data && data.value) {
    updateDisplay(data.value);
  }
});
