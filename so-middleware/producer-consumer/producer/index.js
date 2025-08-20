const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const CONSUMER_URL = process.env.CONSUMER_URL || 'http://consumer-service:3001/process';

app.post('/send', async (req, res) => {
    const message = req.body.message || 'Hello from producer!';
    try {
        await axios.post(CONSUMER_URL, { message });
        res.send('Message sent to consumer.');
    } catch (err) {
        console.error('Error sending to consumer:', err.message);
        res.status(500).send('Failed to send message.');
    }
});

app.listen(3000, () => {
    console.log('Producer listening on port 3000');
});
