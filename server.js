'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./database/db');
const graphqlHTTP = require('express-graphql');
const stationRoute = require('./routes/stationRoute');
const connectionRoute = require('./routes/connectionRoute');
const coTyRoute = require('./routes/connectionTypeRoute');
const cuTyRoute = require('./routes/currentTypeRoute');
const levelsRoute = require('./routes/levelsRoute');
const GQLSchema = require('./schema/schema');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/station', stationRoute);
app.use('/connection', connectionRoute);
app.use('/connectionTypes', coTyRoute);
app.use('/currentType', cuTyRoute);
app.use('/levels', levelsRoute);

app.use(
    '/graphql',
    (req, res) => {
      graphqlHTTP({
        schema: GQLSchema,
        graphiql: true,
      })(req, res)
    }
);


db.on('connected', () => {
  app.listen(3000);
});