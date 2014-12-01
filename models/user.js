"use strict";

var gravatar = require('gravatar');
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User',{
    email: {
      type: DataTypes.STRING,
      unique: 'unique',
      validate:{
        isEmail: true
      }
    },
    firstName: {
      type: DataTypes.STRING,
      validate:{
        min: 2,
        is: /^[a-zA-Z]+$/i
      }
    },
    lastName: {
      type: DataTypes.STRING,
      validate:{
        min: 2,
        is: /^[a-zA-Z]+$/i
      }
    },
    password: {
      type: DataTypes.STRING,
      validate:{
        min: 1
      }
    },
  },{
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Submission);
      }
    },
    instanceMethods: {
      getGravatar: function(size) {
        return gravatar.url(this.email, {s: size, r: 'y', d: 'retro'});
      }
    }
  });
  return User;
};
