const express = require('express');
const app = express();
const port = 3001; // You can change this port

app.use(express.json());

// Set up CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Replace '*' with the allowed origin
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// Define your API routes here
app.get('/api/data', (req, res) => {
  // Your API logic here
  res.json({ message: 'API response' });
});

app.listen(port, () => console.log('Example app is listening on port 3000.'));