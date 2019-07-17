'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('videos', [
      {
        id: 1,
        yt_channel: "simonscat",
        yt_video: "vU4le8fBWqc",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('videos', null, {});
  }
};
