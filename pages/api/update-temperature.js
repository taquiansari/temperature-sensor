let currentTemperature = 25.9; // Default temperature

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { temperature } = req.body;
        if (typeof temperature === 'string' || typeof temperature === 'number') {
            currentTemperature = parseFloat(temperature);
            return res.status(200).json({ message: 'Temperature updated successfully' });
        }
        return res.status(400).json({ error: 'Invalid temperature value' });
    } else if (req.method === 'GET') {
        return res.status(200).json({ temperature: currentTemperature });
    }
    return res.status(405).json({ error: 'Method not allowed' });
}
