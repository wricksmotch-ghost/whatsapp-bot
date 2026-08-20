const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const ACCESS_TOKEN = "YOUR_PERMANENT_ACCESS_TOKEN";
const PHONE_NUMBER_ID = "YOUR_PHONE_NUMBER_ID";

app.get("/webhook", (req, res) => {
  const challenge = req.query["hub.challenge"];
  
  // Directly respond with the challenge string to pass verification
  if (challenge) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(400);
});

app.post("/webhook", async (req, res) => {
  res.sendStatus(200);

  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const message = changes?.value?.messages?.[0];

  if (message && message.from) {
    try {
      await axios.post(
        `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: message.from,
          type: "text",
          text: {
            body: "Thank you for contacting Smotch Printing Solutions! We have received your message and will get back to you shortly.",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Failed to send message:", error.response?.data || error.message);
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
