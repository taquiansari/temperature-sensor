const tempDisplay = document.getElementById('temperature-display');
const sliderContainer = document.getElementById('slider-container');
const tempSlider = document.getElementById('temp-slider');
const sliderValue = document.getElementById('slider-value');

// Check if the user is an admin by looking for `admin=true` in the URL query string
const isAdmin = new URLSearchParams(window.location.search).get('admin') === 'true';

if (isAdmin) {
    sliderContainer.style.display = 'block';

    // Event listener to update temperature on the slider change
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

// Initialize Pusher using environment variables (they will be injected at build time by Next.js)
const pusher = new Pusher('5fb802724c40d44c295c', {
    cluster: 'ap2'  // Access cluster via environment variable
});

const channel = pusher.subscribe('temperature-channel');

// Bind the event to update the temperature display when a new event is received
channel.bind('temperature-update', (data) => {
    const temperature = parseFloat(data.temperature).toFixed(1);
    tempDisplay.innerHTML = `${Math.floor(temperature)}<span>.${temperature.split('.')[1]}</span><strong>&deg;</strong>`;
});

// Fetch the current temperature on page load
async function fetchTemperature() {
    const res = await fetch('/api/update-temperature');
    const data = await res.json();
    const temperature = parseFloat(data.temperature).toFixed(1);
    tempDisplay.innerHTML = `${Math.floor(temperature)}<span>.${temperature.split('.')[1]}</span><strong>&deg;</strong>`;
}
fetchTemperature();
