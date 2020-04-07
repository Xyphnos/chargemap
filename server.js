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
const httpport = 3000;
const httpsport = 8000;

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
    app.listen(httpport, () => console.log(`App listening on port ${httpport}!`));
    https.createServer(options, app).listen(httpsport);

});

app.get('/', (req, res) => {
    res.send('Hello Secure World!');
});

