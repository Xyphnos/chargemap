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
        res.json(await connectionModel.findById(req.params.id));
    } catch (e) {
        console.error('c_list_get', e);
    }
};

const c_post = async(req, res) => {
    try {
        const connection = await connectionModel.create({
                ConnectionTypeID: req.body.ConnectionTypeID,
                LevelID: req.body.LevelID,
                CurrentTypeID: req.body.CurrentTypeID,
                Quantity: req.body.Quantity
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