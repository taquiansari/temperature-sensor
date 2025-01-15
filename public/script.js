const tempDisplay = document.getElementById('temperature-display');
const sliderContainer = document.getElementById('slider-container');
const tempSlider = document.getElementById('temp-slider');
const sliderValue = document.getElementById('slider-value');

// Update temperature display function
function updateDisplay(temperature) {
    const temp = parseFloat(temperature).toFixed(1);
    const [whole, decimal] = temp.split('.');
    tempDisplay.innerHTML = `${whole}<span>.${decimal}</span><strong>&deg;</strong>`;
}

// Check if admin
const isAdmin = new URLSearchParams(window.location.search).get('admin') === 'true';
if (isAdmin) {
    sliderContainer.style.display = 'block';
    
    tempSlider.addEventListener('input', async (e) => {
        const newTemp = e.target.value;
        sliderValue.textContent = `${newTemp}°C`;
        updateDisplay(newTemp);
        
        try {
            const response = await fetch('/api/update-temperature', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ temperature: newTemp }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to update temperature');
            }
        } catch (error) {
            console.error('Error updating temperature:', error);
        }
    });
}

// Initialize Pusher
const pusher = new Pusher('5fb802724c40d44c295c', {
    cluster: 'ap2'
});

const channel = pusher.subscribe('temperature-channel');

// Listen for temperature updates
channel.bind('temperature-update', (data) => {
    updateDisplay(data.temperature);
});

// Fetch initial temperature
async function fetchTemperature() {
    try {
        const response = await fetch('/api/update-temperature');
        if (!response.ok) {
            throw new Error('Failed to fetch temperature');
        }
        const data = await response.json();
        updateDisplay(data.temperature);
    } catch (error) {
        console.error('Error fetching temperature:', error);
    }
}

fetchTemperature();
