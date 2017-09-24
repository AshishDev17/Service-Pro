
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
   userType: 'Provider',
   location: {
      type: 'Point',
      coordinates: [-87.9806265, 42.0883603],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  },
  {
   name: 'Mechanic 2',
   phoneNumber: '02',
   email: 'mechanic02@gmail.com',
   icon: '/images/black_marker.png',
   userType: 'Provider',
   location: {
      type: 'Point',
      coordinates: [-87.6876969, 42.0450722],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  },
  {
   name: 'Mechanic 3',
   phoneNumber: '03',
   email: 'mechanic03@gmail.com',
   icon: '/images/black_marker.png',
   userType: 'Provider',
   location: {
      type: 'Point',
      coordinates: [-88.0834059, 42.0333607],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  },
  {
   name: 'Mechanic 4',
   phoneNumber: '04',
   email: 'mechanic04@gmail.com',
   icon: '/images/black_marker.png',
   userType: 'Provider',
   location: {
      type: 'Point',
      coordinates: [-87.67513043, 41.9214378],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  },
  {
   name: 'Mechanic 5',
   phoneNumber: '05',
   email: 'mechanic05@gmail.com',
   icon: '/images/black_marker.png',
   userType: 'Provider',
   location: {
      type: 'Point',
      coordinates: [-87.6238803, 41.8708586],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  },
  {
   name: 'Mechanic 6',
   phoneNumber: '06',
   email: 'mechanic06@gmail.com',
   icon: '/images/black_marker.png',
   userType: 'Provider',
   location: {
      type: 'Point',
      coordinates: [-88.1535352, 41.7508391],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  },
  {
   name: 'Mechanic 7',
   phoneNumber: '07',
   email: 'mechanic07@gmail.com',
   icon: '/images/black_marker.png',
   userType: 'Provider',
   location: {
      type: 'Point',
      coordinates: [-87.8833991, 42.0333623],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  },
  {
   name: 'Mechanic 8',
   phoneNumber: '08',
   email: 'mechanic08@gmail.com',
   icon: '/images/black_marker.png',
   userType: 'Provider',
   location: {
      type: 'Point',
      coordinates: [-87.8289548, 42.1275267],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  },
  {
   name: 'Mechanic 9',
   phoneNumber: '09',
   email: 'mechanic09@gmail.com',
   icon: '/images/black_marker.png',
   userType: 'Provider',
   location: {
      type: 'Point',
      coordinates: [-87.7539448, 41.8455877],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    }
  },
  {
   name: 'Mechanic 10',
   phoneNumber: '10',
   email: 'mechanic10@gmail.com',
   icon: '/images/black_marker.png',
   userType: 'Provider',
   location: {
      type: 'Point',
      coordinates: [-87.9403418, 41.8994744],
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
