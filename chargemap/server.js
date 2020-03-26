'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./database/db');
const stationRoute = require('./routes/stationRoute');
const connectionRoute = require('./routes/connectionRoute');
const connectionTypeRoute = require('./routes/connectionTypeRoute');
const levelRoute = require('./routes/levelRoute');
const currentTypeRoute = require('./routes/currentTypeRoute');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/station', stationRoute);
app.use('/connection', connectionRoute);
app.use('/connectiontype', connectionTypeRoute);
app.use('/level', levelRoute);
app.use('/currenttype', currentTypeRoute);


db.on('connected', () => {
  app.listen(3000);
});