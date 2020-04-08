'use strict';

require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const cors = require('cors');
const db = require('./database/db');
const graphqlHTTP = require('express-graphql');
const stationRoute = require('./routes/stationRoute');
const connectionRoute = require('./routes/connectionRoute');
const coTyRoute = require('./routes/connectionTypeRoute');
const cuTyRoute = require('./routes/currentTypeRoute');
const levelsRoute = require('./routes/levelsRoute');
const authRoute = require("./routes/authRoute");
const passport = require("./utils/pass");
const GQLSchema = require('./schema/schema');
const sslkey = fs.readFileSync('./cert/ssl-key.pem');
const sslcert = fs.readFileSync('./cert/ssl-cert.pem');
const httpPort = 3000;
const httpsPort = 8000;

const options = {
    key: sslkey,
    cert: sslcert
};

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
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
    if (process.env.NODE_ENV === 'production') {
        const prod = require('./production')(app, process.env.PORT);
    } else {
        const localhost = require('./localhost')(app, process.env.HTTPS_PORT, process.env.HTTP_PORT);
    }

});