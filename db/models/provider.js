'use strict';
var Sequelize = require('sequelize')
var db = require('../index.js')

const Provider = db.define('provider', {
  userName:{
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  phoneNumber:{
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  location:{
    type: Sequelize.GEOMETRY('POINT', 4326),
    allowNull: false
  }
});

module.exports = Provider;
