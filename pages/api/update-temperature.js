import Pusher from "pusher";

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
});

let currentTemperature = 25.9; // Default temperature

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { temperature } = req.body;
        if (typeof temperature === 'string' || typeof temperature === 'number') {
            currentTemperature = parseFloat(temperature);

            // Broadcast the updated temperature
            await pusher.trigger("temperature-channel", "temperature-update", {
                temperature: currentTemperature,
            });

            return res.status(200).json({ message: 'Temperature updated successfully' });
        }
        return res.status(400).json({ error: 'Invalid temperature value' });
    } else if (req.method === 'GET') {
        return res.status(200).json({ temperature: currentTemperature });
    }
    return res.status(405).json({ error: 'Method not allowed' });
}
