'use strict';
// stationRoute
const express = require('express');
const router = express.Router();
const coTyController = require('../controllers/connectionTypeController');

router.get('/', coTyController.coTy_list_get);

router.get('/:id', coTyController.coTy_get);

router.post('/', coTyController.coTy_post);

module.exports = router;