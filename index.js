const express = require('express');
const app = express();
const path = require('path');

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files if needed (e.g., styles, scripts)
app.use(express.static(path.join(__dirname, 'public')));

// Store the status in memory (in a real app, you might use a database)
let statusData = {
    status: 'up',
    message: 'GitHub Actions is running smoothly',
    lastUpdated: new Date().toLocaleString(),
    step: 1,
    commitName: 'Initial commit',
    committer: 'Alice'
};

// Serve the status API
app.get('/status', (req, res) => {
    res.json(statusData);  // Return JSON with status
});

// Route for the frontend (EJS page)
app.get('/', (req, res) => {
    res.render('status', {
        status: statusData.status,
        message: statusData.message,
        lastChecked: statusData.lastUpdated,
        apiUrl: '/status'
    });
});

// Update status manually (to be called by GitHub Actions)
app.post('/update-status', (req, res) => {
    const { status, message, step, commitName, committer } = req.body;  // Extract status and message from request body
    if (status && message) {
        statusData = {
            status: status,  // Use status from body
            message: message,  // Use message from body
            lastUpdated: new Date().toLocaleString(),  // Update timestamp
            step: step || 1,
            commitName: commitName || 'Unknown commit',
            committer: committer || 'Unknown committer'
        };
        console.log('Status updated:', statusData);
        return res.json(statusData);  // Respond with the updated status
    } else {
        return res.status(400).json({ error: 'Invalid input, status and message are required.' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
