const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const userId = req.user ? req.user.id : ''; // Check if user is authenticated
    res.render('index', { userId: userId }); // Pass userId to the template
});

module.exports = router;
