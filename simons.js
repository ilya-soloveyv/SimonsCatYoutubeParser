const fetchUrl = require("fetch").fetchUrl
const youtubedl = require('youtube-dl')
const fs = require('fs')
const path = require('path')
const sec = require('sec')



module.exports = function (bot) {
  var module = {}
  var Video = require('./models').video
  let YT_KEY = process.env.YT_KEY
  let YT_CHANNEL = process.env.YT_CHANNEL

  let tempVideo = path.join(__dirname, 'upload/myvideo.mp4')
  let tempVideoData = {}
  let videoId = null


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

      // bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Video ID: ' + videoId)
      Video.count({
        where: {
          yt_video: videoId
        }
      }).then((count) => {
        if (count == 0) {
          var video = youtubedl('http://www.youtube.com/watch?v=' + videoId, ['--format=18'], {
            cwd: __dirname
          })
          video.on('info', function (info) {
            tempVideoData = info
          })
          video.on('end', () => {
            bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Файл ' + videoId + ' успешно загружен на сервер')
            Video.create({
              yt_channel: process.env.YT_CHANNEL,
              dateCreate: new Date(),
              yt_video: videoId
            }).then(() => {
              if (fs.existsSync(tempVideo)) {
                if (tempVideoData.filesize < 50000000) {
                  bot.sendVideo(process.env.TELEGRAM_CHANNEL, tempVideo, {
                    width: tempVideoData.width,
                    height: tempVideoData.height,
                    file_size: tempVideoData.filesize,
                    caption: tempVideoData.title,
                    duration: sec(tempVideoData.duration)
                  }).then((data) => {
                    bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Файл ' + videoId + ' размещен на канале')
                    fs.unlink(tempVideo, (err) => {
                      bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Временный файл ' + videoId + ' удален с сервера')
                    })
                  }, error => {
                    bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Ошибка загрузки видео ' + videoId + ' на канал')
                  })
                } else {
                  bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Файл ' + videoId + ' превысил 50Мб')
                  fs.unlink(tempVideo, (err) => {
                    bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Временный файл ' + videoId + ' удален с сервера')
                  })
                }
              } else {
                bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Файл ' + videoId + ' не найден на сервере')
              }
            })
          })
          video.pipe(fs.createWriteStream(tempVideo))
        }
      })
      console.log(videoId)
      return videoId;
    })
  }
  return module
}