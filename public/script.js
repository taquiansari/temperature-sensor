import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Wait until the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    // Now we can safely access the DOM elements
    const tempDisplay = document.getElementById("temperature-display");
    const sliderContainer = document.getElementById("slider-container");
    const tempSlider = document.getElementById("temp-slider");
    const sliderValue = document.getElementById("slider-value");
  
    // Firebase configuration (already in your existing code)
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
  
    // Check if admin via URL search parameters
    const isAdmin = new URLSearchParams(window.location.search).get("admin") === "true";
    console.log("Is Admin:", isAdmin); // This should log true when you access with ?admin=true
  
    if (isAdmin) {
      // If it's admin, show the slider
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
  
    // Listen for real-time updates from Firebase
    const tempRef = ref(db, "temperature");
    onValue(tempRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.value) {
        updateDisplay(data.value);
      }
    });
  
    // Update temperature display function
    function updateDisplay(temperature) {
      const temp = parseFloat(temperature).toFixed(1);
      const [whole, decimal] = temp.split(".");
      tempDisplay.innerHTML = `${whole}<span>.${decimal}</span><strong>&deg;</strong>`;
    }
  });
  