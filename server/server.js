const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(bodyParser.json()); // Parse JSON request bodies

let currentTemperature = 25.9; // Initial temperature

// Handle POST request to update temperature
app.post('/temperature', (req, res) => {
    const { newTemperature } = req.body;
    if (newTemperature !== undefined) {
        currentTemperature = newTemperature;
        console.log(`Temperature updated to: ${currentTemperature}°C`);
        res.json({ message: `Temperature updated to ${currentTemperature}°C` });
    } else {
        res.status(400).json({ message: 'Invalid temperature value' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
