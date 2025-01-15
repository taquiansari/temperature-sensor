import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,  // Enabling secure TLS connection
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { temperature } = req.body;
    console.log("Received temperature:", temperature);

    try {
      // Triggering the event to the channel
      await pusher.trigger("temperature-channel", "update-temperature", {
        temperature,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Pusher error:", error);
      res.status(500).json({ success: false, error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

