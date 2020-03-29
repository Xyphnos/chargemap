'use strict';
const stationModel = require('../models/station');

const limitStation = async(res, limit) => {
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
        .limit(limit)
  );
};

const geoStation = async (res, limit, topR, botL) => {
  res.json(
  await stationModel
      .find(({
        Location: {
          $geoWithin: {
            $geometry: {
              "type": "Polygon",
              "coordinates":
              [[
                /*[topR.lat, topR.lng],
                [botL.lat, topR.lng],
                [botL.lat, botL.lng],
                [topR.lat, botL.lng],
                [topR.lat, topR.lng]*/

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
      .limit(limit)
    );
};



const station_list_get = async (req, res) => {
  try {
    const query = req.query;
    let queryLimit = query.limit;
    let top = query.topRight;
    let bot = query.bottomLeft;

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
      geoStation(res, queryLimit, top, bot)
    }

    else {

      if (queryLimit !== undefined){
        queryLimit = parseInt(queryLimit);
        limitStation(res, queryLimit)
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
    const station = await stationModel.findById(req.params.id);
    res.json(station);
  } catch (e) {
    console.error('station_list_get', e);
    res.status(500).json({message: e.message});
  }
};

const station_post = async ( req, res) => {
  let body = JSON.parse(req.body.Location);
  try {
    const post = await stationModel.create({
      Title: req.body.Title,
      AddressLine1: req.body.AddressLine1,
      Town: req.body.Town,
      StateOrProvince: req.body.StateOrProvince,
      Postcode: req.body.Postcode,
      Connections: req.body.Connections,
      Location: {
        type: "Point",
        coordinates: [body.lng, body.lat]
      },
    });
    res.send(`Station created with id: ${post._id}.`);
  } catch(e){
    console.error('station_post', e);
      }
};

const station_edit = async (req, res) => {
  let body = JSON.parse(req.body.Location);
  try {
    const station = await stationModel
        .findByIdAndUpdate(req.params.id, req.query);
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
