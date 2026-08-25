const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/portfolioController');

router.get('/', controller.getPortfolio);
router.get('/all', controller.getAllPortfolios);
router.post('/', upload.single('picture'), controller.createPortfolio);
router.put('/', upload.single('picture'), controller.updatePortfolio);
router.delete('/:id', controller.deletePortfolio);

module.exports = router;
