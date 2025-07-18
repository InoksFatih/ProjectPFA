const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const auth = require('../middleware/auth');
const { memoryUpload } = require('../middleware/upload');

router.get('/:userId', auth, clientController.getClientByUserId);
router.put('/:userId', auth, memoryUpload.single('photo'), clientController.updateClient);

module.exports = router;
