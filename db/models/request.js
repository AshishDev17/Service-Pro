'use strict';
var Sequelize = require('sequelize')
var db = require('../index.js')

const Request = db.define('request', {
  seekerId:{
    type: Sequelize.INTEGER
  },
  providerId:{
    type: Sequelize.INTEGER
  },
  status:{
    type: Sequelize.STRING,
    defaultValue: 'Waiting'
  },
  location:{
    type: Sequelize.ARRAY(Sequelize.STRING)
  }
});

module.exports = Request;
