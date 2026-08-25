require('dotenv').config();
const express = require('express');
const path = require('path');
const portfolioRoutes = require('./routes/portfolio');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// API Routes
app.use('/api/portfolio', portfolioRoutes);

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  res.json({ success: true, message: 'Message received! I will get back to you soon.' });
});

// Page Routes
app.get('/', async (req, res) => {
  const Portfolio = require('./models/Portfolio');
  const portfolio = Portfolio.read();
  res.render('index', { portfolio });
});

app.get('/edit', async (req, res) => {
  const Portfolio = require('./models/Portfolio');
  const portfolio = Portfolio.read();
  res.render('edit', { portfolio });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;