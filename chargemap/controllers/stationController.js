'use strict';
const url = require('url');
const stationModel = require('../models/station');
const connectionModel = require('../models/connection');

const station_list_get = async (req, res) => {
  try {
    const queryLimit = url.parse(req.url, true).query;
    let Qlimit = parseInt(queryLimit.limit);
    if (Number.isInteger(Qlimit) === true){

    }
    else {
      Qlimit = 10;
    }
    const stations = await stationModel
        .find()
        .populate('Connection')
        .limit(Qlimit);
    res.json(stations);
  } catch (e) {
    console.error('station_list_get', e);
    res.status(500).json({message: e.message});
  }
};

const station_get = async (req, res) => {
  try {
    const station = await stationModel.findById(req.params.id);
    res.json(station);
  } catch (e) {
    console.error('station_list_get', e);
    res.status(500).json({message: e.message});
  }
  res.send('With this endpoint you can get one station');
};

const station_post = async ( req, res) => {
  try {

    const post = await stationModel.create({
      Title: req.body.Title,
      AddressLine1: req.body.AddressLine1,
      Town: req.body.Town,
      StateOrProvince: req.body.StateOrProvince,
      Postcode: req.body.Postcode,
      Connections: req.body.Connection,
      Location: req.body.Location,
    });
    res.send(`Station created with id: ${post._id}.`);
  } catch(e){
    console.error(e);
      }
};

const station_edit = (req, res) => {

};

const station_delete = (req, res) => {

};

module.exports = {
  station_list_get,
  station_get,
  station_post,
};
