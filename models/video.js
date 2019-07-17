'use strict';
module.exports = (sequelize, DataTypes) => {
  const video = sequelize.define('video', {
    id: { allowNull: false, type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    yt_channel: { type: DataTypes.STRING },
    yt_video: { type: DataTypes.STRING },
    dateCreate: { type: DataTypes.DATE },
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'video'
  });
  video.associate = function(models) {
    // associations can be defined here
  };
  return video;
};