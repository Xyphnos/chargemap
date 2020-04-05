'use strict';
const levelsModel = require('../models/levels');

const levels_list_get = async (req, res) => {
    try {
        res.json(await levelsModel.find());
    } catch (e) {
        console.error('levels_list_get', e);
        res.status(500).json({message: e.message});
    }
};

const levels_get = async (req, res) => {
    try {
        const levels = await levelsModel.findById(req.query.id);
        res.json(levels);
    } catch (e) {
        console.error('levels_list_get', e);
        res.status(500).json({message: e.message});
    }
    res.send('With this endpoint you can get one level');
};

const levels_post = (req, res) => {
    res.send('post ');
};

module.exports = {
    levels_list_get,
    levels_get,
    levels_post,
};