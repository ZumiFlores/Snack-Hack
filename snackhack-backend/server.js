const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// SnackHack
app.get('/api/SnackHack', (req, res) => {
    res.send('Welcome to SnackHack!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SnackHack server is running on port ${PORT}`));
