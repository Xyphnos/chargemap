'use strict';
const cuTyModel = require('../models/currentTypeController');

const cuTy_list_get = async (req, res) => {
    try {
        res.json(await cuTyModel.find());
    } catch (e) {
        console.error('cuTy_list_get', e);
        res.status(500).json({message: e.message});
    }
};

const cuTy_get = async (req, res) => {
    try {
        const cuTy = await cuTyModel.findById(req.params.id);
        res.json(cuTy);
    } catch (e) {
        console.error('cuTy_list_get', e);
        res.status(500).json({message: e.message});
    }
    res.send('With this endpoint you can get one station');
};

const cuTy_post = (req, res) => {
    res.send('post ');
};

module.exports = {
    cuTy_list_get,
    cuTy_get,
    cuTy_post,
};