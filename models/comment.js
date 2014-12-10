"use strict";

module.exports = function(sequelize, DataTypes) {
  var comment = sequelize.define("comment", {
    movieId: DataTypes.INTEGER,
    text: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        models.comment.belongsTo(models.movie)
      }
    }
  });

  return comment;
};
