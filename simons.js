const fetchUrl = require("fetch").fetchUrl

module.exports = function (bot) {
  var module = {}
  var Video = require('./models').video
  let YT_KEY = process.env.YT_KEY
  let YT_CHANNEL = process.env.YT_CHANNEL

  module.sendMessage = () => {
    bot.sendMessage(process.env.TELEGRAM_ADMIN, 'sendMessage')
  }

  module.getVideo = async () => {
    var video = await Video.findAll()
    console.log(video)
  }

  module.getYoutube = async () => {
    await fetchUrl("https://www.googleapis.com/youtube/v3/search?key=" + YT_KEY + "&channelId=" + YT_CHANNEL + "&part=snippet&order=date&maxResults=1", function (error, meta, body) {
      if (error) {
        bot.sendMessage(process.env.TELEGRAM_ADMIN, 'ERROR getYoutube error')
        return false
      }
      if (meta.status != 200) {
        bot.sendMessage(process.env.TELEGRAM_ADMIN, 'ERROR getYoutube meta status')
        return false
      }
      var data = JSON.parse(body)
      let videoId = data.items[0].id.videoId

      bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Video ID: ' + videoId)

      console.log(videoId)
      return videoId;
    })
  }

  return module
  
  //   var data = JSON.parse(body)
  //   if (!error) {
      // bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Запущено без ошибок')
    //   if (meta.status == 200) {
    //     videoId = data.items[0].id.videoId
    //     console.log(videoId)
    //     Video.count({
    //       where: {
    //         yt_video: videoId
    //       }
    //     }).then((count) => {
    //       if (count == 0) {
    //         var video = youtubedl('http://www.youtube.com/watch?v=' + videoId, ['--format=18'], {
    //           cwd: __dirname
    //         })
    //         video.on('info', function (info) {
    //           tempVideoData = info
    //         })
    //         video.on('end', () => {
    //           bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Файл успешно загружен на сервер')
    //           Video.create({
    //             yt_channel: process.env.YT_CHANNEL,
    //             dateCreate: new Date(),
    //             yt_video: videoId
    //           }).then(() => {
    //             if (fs.existsSync(tempVideo)) {
    //               if (tempVideoData.filesize < 50000000) {
    //                 bot.sendVideo(process.env.TELEGRAM_CHANNEL, tempVideo, {
    //                   width: tempVideoData.width,
    //                   height: tempVideoData.height,
    //                   file_size: tempVideoData.filesize,
    //                   caption: tempVideoData.title,
    //                   duration: sec(tempVideoData.duration)
    //                 }).then((data) => {
    //                   bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Файл размещен на канале')
    //                   fs.unlink(tempVideo, (err) => {
    //                     bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Временный файл удален с сервера')
    //                   })
    //                 }, error => {
    //                   bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Ошибка загрузки видео на канал')
    //                 })
    //               } else {
    //                 bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Файл превысил 50Мб')
    //                 fs.unlink(tempVideo, (err) => {
    //                   bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Временный файл удален с сервера')
    //                 })
    //               }
    //             } else {
    //               bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Файл не найден на сервере')
    //             }
    //           })
    //         })
    //         video.pipe(fs.createWriteStream(tempVideo))
    //       }
    //     })
    //   } else {
    //     bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Ошибка META STATUS')
    //     console.log('status', meta.status)
    //   }
  //   } else {
  //     bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Ошибка обращения к Google API')
  //   }
  // })
  // return true
}