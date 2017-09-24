'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const { resolve } = require('path');
const { Provider, Request } = require('../db/models/index');
const Sequelize = require('sequelize');
const pkg = require('../package.json');
const app = express();
const Promise = require('bluebird');
const db = require('../db/index');
const session = require('express-session');
const passport = require('passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sessionStore = new SequelizeStore({db});

// passport registration
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  db.models.user.findById(id)
    .then(user => done(null, user))
    .catch(done));

if (process.env.NODE_ENV !== 'production') {
  // Logging middleware (non-production only)
  app.use(require('volleyball'))
}

//The code below works because `.use` returns `this` which is `app`. So what we want to return in the `module.exports` is `app`, and we can chain on that declaration because each method invokation returns `app` after mutating based on the middleware functions
module.exports = app
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(session({
    secret: process.env.SESSION_SECRET || 'my best friend is Cody',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
  }))
  .use(passport.initialize())
  .use(passport.session())
  .use('/auth', require('./auth')) //Authenticate api
  .use('/api', require('./api')) // Serve our api
  .use(express.static(resolve(__dirname, '..', 'public'))) // Serve static files from ../public
  .use(express.static(resolve(__dirname, '..', 'node_modules'))) // Serve static files from ../node_modules
  .use((err, req, res, next) => {   //error handling middleware
  console.log(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal Error!')})
  .get('/*', (_, res) => res.sendFile(resolve(__dirname, '..', 'public', 'index.html'))) // Send index.html for any other requests.

// notice the use of `_` as the first parameter above. This is a pattern for parameters that must exist, but you don't use or reference (or need) in the function body that follows.

if (module === require.main) {
  // Start listening only if we're the main module.

  /*
    https://nodejs.org/api/modules.html#modules_accessing_the_main_module
      - This (module === require.main) will be true if run via node foo.js, but false if run by require('./foo')
      - If you want to test this, log `require.main` and `module` in this file and also in `api.js`.
        * Note how `require.main` logs the same thing in both files, because it is always referencing the "main" import, where we starting running in Node
        * In 'start.js', note how `module` is the same as `require.main` because that is the file we start with in our 'package.json' -- `node server/start.js`
        * In 'api.js', note how `module` (this specific file - i.e. module) is different from `require.main` because this is NOT the file we started in and `require.main` is the file we started in
          ~ To help compare these objects, reference each of their `id` attributes
  */
  const server = app.listen(
    process.env.PORT || 1337,
    () => {
      console.log(`--- Started HTTP Server for ${pkg.name} ---`)
      console.log(`Listening on ${JSON.stringify(server.address())}`)
    }
  )

  const io = require('socket.io')(server);

  io.on('connection', socket => {

    console.log(socket.id, ' has made a persistent connection to the server!');

    // socket listening on 'join' event
    socket.on('join', data => {
      // if (data.seekerId) {
      //   socket.join(data.seekerId); //seeker joins a unique room/channel that's named after the userId
      //   console.log("Seeker joined room: " + data.seekerId);
      // }
      // else if (data.providerId) {
      //   socket.join(data.providerId); //provider joins a unique room/channel that's named after the userId
      //   Provider.
      //   console.log("Provider joined room: " + data.providerId);
      // }

      if (data.userType === 'Seeker') {
        socket.join(data.email); //seeker joins a unique room/channel that's named after the userId
        console.log("Seeker joined room: " + data.email);
      }
      else if (data.userType === 'Provider') {
        socket.join(data.email); //provider joins a unique room/channel that's named after the userId
        console.log("Provider joined room: " + data.email);
        Provider.findOne({
          where: {
            email: data.email,
          }
        })
        .then(provider => {
          if (!provider){
            return Provider.create({
              name: data.name,
              phoneNumber: data.phoneNumber,
              email: data.email,
              icon: data.icon,
              userType: data.userType,
              location: data.location
            });
          }
          else {
            return provider.update({
              location: data.location
            });
          }
        })
        .catch(error => console.error(error));
      }
    });

    // socket listening on 'service-request' event
    socket.on('service-request', (seekerDetails) => {
      const seekerId = seekerDetails.id;
      const seekerEmail = seekerDetails.email;
      const status = 'Waiting';
      const long = seekerDetails.location.coordinates[0];
      const lat = seekerDetails.location.coordinates[1];
      const seekerLocation = [long, lat];

      Request.create({
        seekerId: seekerId,
        status: status,
        seekerRequestedLocation: seekerLocation
      })
        .then((request) => {
          const findProvider = Provider.findAll({
            where: Sequelize.where(
              Sequelize.fn('ST_DWithin',
                Sequelize.col('location'),
                Sequelize.fn('ST_SetSRID',
                  Sequelize.fn('ST_MakePoint',
                    +long, +lat),
                  4326),
                0.7),
              true)
          });

          return Promise.all([findProvider, request])
        })
        .spread((providers, request) => {
          seekerDetails.requestId = request.id;
          providers.forEach(provider => {
            io.sockets.in(provider.email).emit('service-request', seekerDetails);
          });
          io.sockets.in(seekerEmail).emit('service-request', providers);
          return null;
        })
        .catch(err => console.error(err));
    });

    // socket listening on 'request-accepted' event
    socket.on('request-accepted', (data) => {
      const requestId = data.seekerDetails.requestId;
      const seekerEmail = data.seekerDetails.email;
      const providerId = data.providerDetails.id;
      const status = 'Engaged';
      const long = data.providerDetails.location.coordinates[0];
      const lat = data.seekerDetails.location.coordinates[1];
      const providerLocation = [long, lat];

      Request.findById(requestId)
        .then(request => {
          return request.update({
            providerId: providerId,
            status: status,
            providerAcceptedLocation:  providerLocation
          });
        })
        .then(() => {
          io.sockets.in(seekerEmail).emit('request-accepted', data.providerDetails);

          return null;
        })
        .catch(err => console.error(err));
    });
  });
}
