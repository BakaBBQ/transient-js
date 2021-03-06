"use strict";

var gravatar = require('gravatar');
var changeCase = require('change-case');
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
    description: {
      type: DataTypes.STRING,
      validate:{
        max: 400
      }
    },
    password: {
      type: DataTypes.STRING,
      validate:{
        min: 1
      }
    }
  },{
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Submission);
      }
    },
    instanceMethods: {
      getGravatar: function(size) {
        var url = gravatar.url(this.email, {s: size, r: 'y', d: 'retro'});
        url = url.replace('www.gravatar', 'gravatar.duoshuo');
        return url;
      },

      getFullName: function(){
        return changeCase.title(this.firstName + ' ' + this.lastName);
      },

      getUserPageRoute: function(){
        return ('/user/' + this.firstName + '-' + this.lastName);
      }
    }
  });
  return User;
};
