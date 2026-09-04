const express = require('express');
const { execFile } = require('child_process');
const he = require('he');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.get('/search', (req, res) => {
  const query = req.query.q || '';
  const safeQuery = he.encode(query);
  res.send(`<h1>Search Results for: ${safeQuery}</h1>`);
});

app.get('/ping', (req, res) => {
  const host = req.query.host;
  
  if (!host) {
    return res.status(400).send('Host parameter is required');
  }

  const validHostRegex = /^[a-zA-Z0-9.-]+$/;
  if (!validHostRegex.test(host)) {
    return res.status(400).send('Invalid host format');
  }

  execFile('ping', ['-c', '1', host], (error, stdout) => {
    if (error) {
      return res.status(500).send('Error executing command');
    }
    res.send(`<pre>${he.encode(stdout)}</pre>`);
  });
});

module.exports = app;
