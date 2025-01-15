// Check if the user is admin
const isAdmin = new URLSearchParams(window.location.search).get('admin') === 'true';

const tempDisplay = document.getElementById('temperature-display');
const sliderContainer = document.getElementById('slider-container');
const tempSlider = document.getElementById('temp-slider');
const sliderValue = document.getElementById('slider-value');

// Show slider only if admin
if (isAdmin) {
    sliderContainer.style.display = 'block';
    tempSlider.addEventListener('input', async (e) => {
        const newTemp = e.target.value;
        sliderValue.textContent = `${newTemp}°C`;
        tempDisplay.innerHTML = `${Math.floor(newTemp)}<span>.${newTemp.split('.')[1] || 0}</span><strong>&deg;</strong>`;

        // Update temperature on server
        await fetch('/api/update-temperature', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ temperature: newTemp }),
        });
    });
}

// Fetch the current temperature from the server
async function fetchTemperature() {
    const res = await fetch('/api/update-temperature');
    const data = await res.json();
    const temperature = parseFloat(data.temperature).toFixed(1);
    tempDisplay.innerHTML = `${Math.floor(temperature)}<span>.${temperature.split('.')[1]}</span><strong>&deg;</strong>`;
}
fetchTemperature();
setInterval(fetchTemperature, 5000); // Update every 5 seconds
