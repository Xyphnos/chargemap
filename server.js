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
const authRoute = require("./routes/authRoute");
const passport = require("./utils/passport");
const GQLSchema = require('./schema/schema');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


const checkAuth = (req, res) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        if(err || !user) {
            throw new Error("User not authenticated!");
        }
    })(req, res);
};

app.use("/auth", authRoute);


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
          context: { req, res, checkAuth },
      })(req, res)
    }
);


db.on('connected', () => {
  app.listen(3000);
});