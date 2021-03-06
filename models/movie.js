"use strict";

module.exports = function(sequelize, DataTypes) {
  var movie = sequelize.define("movie", {
    imdb_code: DataTypes.STRING,
    movie_title: DataTypes.STRING,
    year: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return movie;
};
