require('dotenv').config()
const express = require('express')
const app = express()
const CronJob = require('cron').CronJob;
const fetchUrl = require("fetch").fetchUrl;
const bodyParser = require('body-parser')
const fs = require('fs')
const youtubedl = require('youtube-dl')
const path = require('path')
const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true })
const sec = require('sec')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
})

var Video = require('./models').video

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Приложение Simon`s Cat Parser перезапустилось')

const tempVideo = path.join(__dirname, 'upload/myvideo.mp4')
var tempVideoData = {}
var videoId = null


// new CronJob('*/5 * * * *', function () {
  fetchUrl("https://www.googleapis.com/youtube/v3/search?key=" + process.env.YT_KEY + "&channelId=" + process.env.YT_CHANNEL + "&part=snippet,id&order=date&maxResults=1", function (error, meta, body) {
    var data = JSON.parse(body)
    if (!error) {
      if (meta.status == 200) {
        videoId = data.items[0].id.videoId
        console.log(videoId)
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
              bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Файл успешно загружен на сервер')
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
                      bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Файл размещен на канале')
                      fs.unlink(tempVideo, (err) => {
                        bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Временный файл удален с сервера')
                      })
                    }, error => {
                      bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Ошибка загрузки видео на канал')
                    })
                  } else {
                    bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Файл превысил 50Мб')
                    fs.unlink(tempVideo, (err) => {
                      bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Временный файл удален с сервера')
                    })
                  }
                } else {
                  bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Файл не найден на сервере')
                }
              })
            })
            video.pipe(fs.createWriteStream(tempVideo))
          }
        })
      } else {
        bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Ошибка META STATUS')
        console.log('status', meta.status)
      }
    } else {
      bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Ошибка обращения к Google API')
    }
  })
// }, null, true, 'America/Los_Angeles')
