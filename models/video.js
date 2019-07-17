'use strict';
module.exports = (sequelize, DataTypes) => {
  const video = sequelize.define('video', {
    yt_channel: DataTypes.STRING
  }, {});
  video.associate = function(models) {
    // associations can be defined here
  };
  return video;
};