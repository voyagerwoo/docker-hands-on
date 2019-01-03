const express = require('express');

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
app.get('/', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`request from ${ip}`)
    res.send('Hello I-scream edu!\n');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
