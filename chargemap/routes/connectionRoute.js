'use strict';
// stationRoute
const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connectionController');

router.get('/', connectionController.c_list_get);

router.get('/:id', connectionController.c_get);

router.post('/', connectionController.c_post);

module.exports = router;