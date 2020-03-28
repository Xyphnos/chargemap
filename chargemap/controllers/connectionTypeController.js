'use strict';
const coTyModel = require('../models/connectionTypeController');

const coTy_list_get = async (req, res) => {
    try {
        res.json(await coTyModel.find());
    } catch (e) {
        console.error('coTy_list_get', e);
        res.status(500).json({message: e.message});
    }
};

const coTy_get = async (req, res) => {
    try {
        const station = await coTyModel.findById(req.params.id);
        res.json(station);
    } catch (e) {
        console.error('coTy_list_get', e);
        res.status(500).json({message: e.message});
    }
    res.send('With this endpoint you can get one station');
};

const coTy_post = (req, res) => {
    res.send('With this endpoint you can add stations');
};

module.exports = {
    coTy_list_get,
    coTy_get,
    coTy_post,
};