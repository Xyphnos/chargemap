'use strict';
const connectionModel = require('../models/connection');

const c_list_get = async (req, res) => {
    try {
        res.json(await connectionModel.find());

    } catch (e) {
        console.error('c_list_get', e);
    }
};

const c_get = async (req, res) => {
    try {
        res.json(await connectionModel.findById(req.params.id));
    } catch (e) {
        console.error('c_list_get', e);
    }
};

const c_post = (req, res) => {
    res.send('Added a connection.');
};

module.exports = {
    c_list_get,
    c_get,
    c_post,
};