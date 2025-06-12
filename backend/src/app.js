const express = require('express');
const userRoutes = require('./routes/userRoutes');
const speakerRoutes = require('./routes/speakerRoutes');

const app = express();

app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', speakerRoutes);

module.exports = app;
