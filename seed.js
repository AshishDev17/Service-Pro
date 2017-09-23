
'use strict';
const db = require('./db/index');
const {Provider} = require('./db/models/index');
const Promise = require('bluebird');
const chalk = require('chalk');

const providers = [
  {
   name: 'Mechanic 1',
   phoneNumber: '01',
   email: 'mechanic01@gmail.com',
   icon: '/images/black_marker.png',
   location: {
      type: 'Point',
      coordinates: [-87.631677, 41.808990],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  },
  {
   name: 'Mechanic 2',
   phoneNumber: '02',
   email: 'mechanic02@gmail.com',
   icon: '/images/black_marker.png',
   location: {
      type: 'Point',
      coordinates: [-87.585388, 41.790797],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  },
  {
   name: 'Mechanic 3',
   phoneNumber: '03',
   email: 'mechanic03@gmail.com',
   icon: '/images/black_marker.png',
   location: {
      type: 'Point',
      coordinates: [-87.624352, 41.884238],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  },
  {
   name: 'Mechanic 4',
   phoneNumber: '04',
   email: 'mechanic04@gmail.com',
   icon: '/images/black_marker.png',
   location: {
      type: 'Point',
      coordinates: [-87.632031, 41.885736],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  },
  {
   name: 'Mechanic 5',
   phoneNumber: '05',
   email: 'mechanic05@gmail.com',
   icon: '/images/black_marker.png',
   location: {
      type: 'Point',
      coordinates: [-87.636659, 41.888285],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  }
];


const seedDB = () => {
  return Promise.all(providers.map((provider) => {
    return Provider.create(provider);
  }));
};

const syncDB = () => {

  db.didSync
  .then(() => {
    console.log( chalk.blue('syncing db....'));
    return db.sync({force: true});
  })
  .then(() => {
    console.log(chalk.green('seeding db....'));
    return seedDB();
  })
  .catch((err) => {
    console.log(chalk.red('error while seeding'));
    console.log(err.stack);
  })
  .then(() => {
    console.log(chalk.green('before closing db'));
    db.close();
    return null;
  });
};

syncDB();
