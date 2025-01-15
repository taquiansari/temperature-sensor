import Pusher from "pusher";

// Initialize Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

// Store current temperature in memory (you might want to use a database in production)
let currentTemperature = 25.9;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { temperature } = req.body;
    currentTemperature = temperature;
    console.log("Received temperature:", temperature);

    try {
      // Make sure to use the same event name as in the frontend
      await pusher.trigger("temperature-channel", "temperature-update", {
        temperature,
      });
      res.status(200).json({ success: true, temperature });
    } catch (error) {
      console.error("Pusher error:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else if (req.method === "GET") {
    // Handle GET requests by returning the current temperature
    res.status(200).json({ temperature: currentTemperature });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
