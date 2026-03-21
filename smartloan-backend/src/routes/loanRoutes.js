const express = require('express');
const router = express.Router();

// placeholder
router.get('/test', (req, res) => res.json({ message: 'route works' }));

module.exports = router;
