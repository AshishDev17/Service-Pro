
'use strict';
var Sequelize = require('sequelize');
var db = require('../index.js');

const Provider = db.define('provider', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  phoneNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  icon: {
    type: Sequelize.STRING,
  },
  userType: {
    type: Sequelize.STRING,
  },
  location: {
    type: Sequelize.GEOMETRY('POINT', 4326),
    allowNull: false,
  }
});

module.exports = Provider;

Provider.findProviders = (long, lat, range) => {
  return Provider.findAll({
      where: Sequelize.where(
        Sequelize.fn('ST_DWithin',
          Sequelize.col('location'),
          Sequelize.fn('ST_SetSRID',
            Sequelize.fn('ST_MakePoint',
              long, lat),
            4326),
          +range * 0.016),
        true)
    });
};
