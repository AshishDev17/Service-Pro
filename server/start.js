'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const { resolve } = require('path')
const { Provider, Request } = require('../db/models/index')
const Sequelize = require('sequelize')
const pkg = require('../package.json')
const app = express()
const Promise = require('bluebird')

if (process.env.NODE_ENV !== 'production') {
  // Logging middleware (non-production only)
  app.use(require('volleyball'))
}

//The code below works because `.use` returns `this` which is `app`. So what we want to return in the `module.exports` is `app`, and we can chain on that declaration because each method invokation returns `app` after mutating based on the middleware functions
module.exports = app
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(express.static(resolve(__dirname, '..', 'public'))) // Serve static files from ../public
  .use(express.static(resolve(__dirname, '..', 'node_modules'))) // Serve static files from ../node_modules
  .use('/api', require('./api')) // Serve our api
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
      if (data.seekerId) {
        socket.join(data.seekerId); //seeker joins a unique room/channel that's named after the userId
        console.log("Seeker joined room: " + data.seekerId);
      }
      else if (data.providerId) {
        socket.join(data.providerId); //provider joins a unique room/channel that's named after the userId
        console.log("Provider joined room: " + data.providerId);
      }
    });

    // socket listening on 'service-request' event
    socket.on('service-request', (seekerDetails) => {
      const seekerId = seekerDetails.seekerId;
      const status = 'Waiting';
      const long = seekerDetails.location.longitude;
      const lat = seekerDetails.location.latitude;
      const location = [long, lat];

      Request.create({
        seekerId: seekerId,
        status: status,
        location: location
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
                0.2),
              true)
          });

          return Promise.all([findProvider, request])
        })
        .spread((providers, request) => {
          seekerDetails.requestId = request.id;
          console.log(seekerDetails);
          providers.forEach(provider => {
            io.sockets.in(provider.id).emit('service-request', seekerDetails);
          });

          return null;
        })
        .catch(err => console.error(err));
    });

    // socket listening on 'request-accepted' event
    socket.on('request-accepted', (data) => {
      const requestId = data.seekerDetails.requestId;
      const seekerId = data.seekerDetails.seekerId;
      const providerId = data.providerDetails.id;
      const status = 'Engaged';
      const long = data.seekerDetails.location.longitude;
      const lat = data.seekerDetails.location.latitude;
      const location = [long, lat];

      Request.findById(requestId)
        .then(request => {
          return request.update({
            seekerId: seekerId,
            providerId: providerId,
            status: status,
            location: location
          });
        })
        .then(() => {
          io.sockets.in(seekerId).emit('request-accepted', data.providerDetails);

          return null;
        })
        .catch(err => console.error(err));
    });
  });
}
