'use strict'
const providerRouter = require('express').Router();
const { Provider } = require('../db/models/index');
const Sequelize = require('sequelize');

module.exports = providerRouter;

//Get '/api/providers' => get all providers within certain mile range
providerRouter.get('/', (req, res, next) => {
  //find providers within a range (1 mile is approx equals to 0.016 degrees)
  if (req.query.lat && req.query.long && req.query.range) {
     Provider.findProviders(req.query.long, req.query.lat, req.query.range)
    .then(providers => res.status(200).json(providers))
    .catch(next)
  }
  // find all providers
  else {
    Provider.findAll()
      .then(allproviders => res.status(200).json(allproviders))
      .catch(next);
  }
});

//Get '/' => get all providers
// providerRouter.get('/', (req, res, next) => {
//   Provider.findAll()
//   .then(allproviders => res.status(200).json(allproviders))
//   .catch(next);
// });

//Get '/:providerId' => get provider by id
providerRouter.get('/:providerId', (req, res, next) => {
  Provider.findById(req.params.providerId)
    .then(provider => res.status(200).json(provider))
    .catch(next);
})

// POST '/' => create a new provider
// providerRouter.post('/', (req, res, next) => {
//   console.log(req.body);
//   let point = {
//     type: 'Point',
//     coordinates: [req.body.long, req.body.lat],
//     crs: { type: 'name', properties: { name: 'EPSG:4326'} }
//   }

//   Provider.create({
//     userName : req.body.userName,
//     phoneNumber : req.body.phoneNumber,
//     email : req.body.email,
//     location : point
//   })
//   .then(provider => res.status(200).json(provider))
//   .catch(next);
// });
