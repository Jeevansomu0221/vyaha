require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 7000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });

// Admin routes
app.use('/api/admin', adminRoutes);

// Optional: health
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
