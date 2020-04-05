'use strict';
const connectionModel = require('../models/connection');

const c_list_get = async (req, res) => {
    try {
        res.json(
            await connectionModel.find()
        );

    } catch (e) {
        console.error('c_list_get', e);
    }
};

const c_get = async (req, res) => {
    try {
        res.json(await connectionModel.findById(req.query.id));
    } catch (e) {
        console.error('c_list_get', e);
    }
};

const c_post = async(req, res) => {
    try {
        const connection = await connectionModel.create({
                ConnectionTypeID: req.query.ConnectionTypeID,
                LevelID: req.query.LevelID,
                CurrentTypeID: req.query.CurrentTypeID,
                Quantity: req.query.Quantity
            }
        );
        res.send(`Station created with id: ${connection._id}.`);
    }
    catch(e){
        console.error('c_post', e);
    }

};

module.exports = {
    c_list_get,
    c_get,
    c_post,
};