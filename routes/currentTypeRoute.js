'use strict';
// stationRoute
const express = require('express');
const router = express.Router();
const cuTyController = require('../controllers/currentTypeController');

router.get('/', cuTyController.cuTy_list_get);

router.get('/:id', cuTyController.cuTy_get);

router.post('/', cuTyController.cuTy_post);

module.exports = router;