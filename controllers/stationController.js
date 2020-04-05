'use strict';
const stationModel = require('../models/station');
const connectionModel = require('../models/connection');

const limitStation = async(res, limit, start) => {
  res.json(
    await stationModel
        .find()
        .populate({
          path: "Connections",
      populate: [
      {path: "ConnectionType"},
      {path: "Level"},
      {path: "CurrentType"}
    ]
  })
        .skip(start)
        .limit(limit)
  );
};

const geoStation = async (res, limit, start, topR, botL) => {
  res.json(
  await stationModel
      .find(({
        Location: {
          $geoWithin: {
            $geometry: {
              "type": "Polygon",
              "coordinates":
              [[
            [topR.lng, topR.lat],
            [botL.lng, topR.lat],
            [botL.lng, botL.lat],
            [topR.lng, botL.lat],
            [topR.lng, topR.lat]

              ]]

            }
          }
        }
      }))
      .skip(start)
      .limit(limit)
      .populate({
        path: "Connections",
        populate: [
          {path: "ConnectionType"},
          {path: "Level"},
          {path: "CurrentType"}
        ]
      })
      /*.where({

      })*/
    );
};



const station_list_get = async (req, res) => {
  try {
    const query = req.query;
    let queryLimit = query.limit;
    let top = query.topRight;
    let bot = query.bottomLeft;
    let start = 0;
    if(req.query.start){start = +req.query.start}

    try {
      top = JSON.parse(top);
      bot = JSON.parse(bot);
    }catch(e){
      res.return
    }


    if(top !== undefined && bot !== undefined){
      if (queryLimit !== undefined) {
        queryLimit = parseInt(queryLimit);
      }
      else{
        queryLimit = 10;
      }
      geoStation(res, queryLimit, start, top, bot)
    }

    else {

      if (queryLimit !== undefined){
        queryLimit = parseInt(queryLimit);
        limitStation(res, queryLimit, start)
      }

      else {
        limitStation(res, 10)
      }
    }
  } catch (e) {
    console.error('station_list_get', e);
    res.status(500).json({message: e.message});
  }
};

const station_get = async (req, res) => {
  try {
    const station = await stationModel.findById(req.query.id);
    res.json(station);
  } catch (e) {
    console.error('station_list_get', e);
    res.status(500).json({message: e.message});
  }
};

const station_post = async (req, res) => {
  const LocC = JSON.parse(req.query.Location);
  const connections = req.body.Connections;
  try {
    const post = await stationModel.create({
      Title: req.query.Title,
      AddressLine1: req.query.AddressLine1,
      Town: req.query.Town,
      StateOrProvince: req.query.StateOrProvince,
      Postcode: req.query.Postcode,
      Connections: req.query.Connections,
      Location: {
        type: "Point",
        coordinates: [LocC.lng, LocC.lat]
      },
    });
    res.send(`Station created with id: ${post._id}.`);
  } catch(e){
    console.error('station_post', e);
      }
};

const station_edit = async (req, res) => {
  let body = JSON.parse(req.query.Location);
  try {
    const station = await stationModel
        .findByIdAndUpdate(req.query.id, req.query);
    res.send(`Station edited with id: ${edit._id}.`);
  } catch(e){
    console.error('station_edit', e);
  }
};

const station_delete = async(req, res) => {
  try{
    await stationModel.deleteOne(req.query.id);
    console.log('Station deleted');
    res.json('station deleted')
  }catch(e){
    console.error('station_delete: ', e);
  }
};

module.exports = {
  station_list_get,
  station_get,
  station_post,
  station_delete,
  station_edit,
};
