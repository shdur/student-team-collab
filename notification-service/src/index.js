// Notification service entry point
const express = require('express');

const app = express();
const port = 4005;

app.get('/', (req, res) => {
  res.send('Notification service is running!');
});

app.listen(port, () => {
  console.log(`Notification service listening on port ${port}`);
});
