'use strict';
var Sequelize = require('sequelize');
var db = require('../index.js');

const Seeker = db.define('seeker', {
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
  location: {
    type: Sequelize.GEOMETRY('POINT', 4326),
    allowNull: false,
  }
});

module.exports = Seeker;
