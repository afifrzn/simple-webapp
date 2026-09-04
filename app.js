const express = require('express');
const { exec } = require('child_process');
const app = express();

app.use(express.json());

// Endpoint Normal (Health Check)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Endpoint Rentan Reflected XSS (Target SAST & DAST)
app.get('/search', (req, res) => {
  const query = req.query.q || '';
  // Celah Keamanan: Mengembalikan input pengguna langsung ke respon HTML tanpa sanitasi
  res.send(`<h1>Search Results for: ${query}</h1>`);
});

// Endpoint Rentan Command Injection (Target SAST & DAST)
app.get('/ping', (req, res) => {
  const host = req.query.host;
  if (!host) {
    return res.status(400).send('Host parameter is required');
  }
  // Celah Keamanan: Mengeksekusi string shell langsung dari input pengguna
  exec(`ping -c 1 ${host}`, (error, stdout) => {
    if (error) {
      return res.status(500).send('Error executing command');
    }
    res.send(`<pre>${stdout}</pre>`);
  });
});

module.exports = app;
