const Portfolio = require('../models/Portfolio');

exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = Portfolio.read();
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllPortfolios = async (req, res) => {
  try {
    const portfolio = Portfolio.read();
    res.json([portfolio]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPortfolio = async (req, res) => {
  try {
    const { name, bio, projects } = req.body;
    const parsedProjects = typeof projects === 'string' ? JSON.parse(projects) : projects;

    const portfolio = {
      name,
      bio,
      projects: Array.isArray(parsedProjects) ? parsedProjects : [],
      picture: req.file ? `/uploads/${req.file.filename}` : '/assets/ezra.jpg'
    };

    Portfolio.write(portfolio);
    res.status(201).json(portfolio);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updatePortfolio = async (req, res) => {
  try {
    const { name, bio, projects } = req.body;
    const parsedProjects = typeof projects === 'string' ? JSON.parse(projects) : projects;

    const existing = Portfolio.read();
    const updated = {
      name,
      bio,
      projects: Array.isArray(parsedProjects) ? parsedProjects : [],
      picture: req.file ? `/uploads/${req.file.filename}` : existing.picture
    };

    Portfolio.write(updated);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deletePortfolio = async (req, res) => {
  res.status(400).json({ message: 'Delete not supported in JSON mode. Reset the JSON file manually if needed.' });
};
