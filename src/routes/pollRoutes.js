const express = require('express');
const router = express.Router();
const { vote, getPollResults } = require('../controllers/pollController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/:pollId/vote', vote);
router.get('/:pollId/results', getPollResults);

module.exports = router;