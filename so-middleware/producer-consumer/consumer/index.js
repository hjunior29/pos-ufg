const express = require('express');
const app = express();

app.use(express.json());

app.post('/process', (req, res) => {
    console.log('Message received from producer:', req.body.message);
    res.send('Message processed by consumer.');
});

app.listen(3001, () => {
    console.log('Consumer listening on port 3001');
});
