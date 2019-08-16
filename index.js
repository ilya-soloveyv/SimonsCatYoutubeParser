require('dotenv').config()
const express = require('express')
const app = express()
const CronJob = require('cron').CronJob

const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true })

const bodyParser = require('body-parser')
const fs = require('fs')
const youtubedl = require('youtube-dl')
const path = require('path')
const sec = require('sec')
// const Sequelize = require('sequelize')
// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
//   host: process.env.DB_HOST,
//   dialect: 'mysql'
// })

// var Video = require('./models').video

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const tempVideo = path.join(__dirname, 'upload/myvideo.mp4')
var tempVideoData = {}
var videoId = null

// const Simons = require('./simons')(bot)
const Simons = require('./simons')(bot)

if (process.env.NODE_ENV == 'development') {
  Simons.getYoutube()
  // const getInfo = async () => {
  //   var temp = 
  //   console.log('in function', temp)
  //   return temp;
  //  }
   
  //  getInfo()
  
  // console.log('index.js', )
  // Simons()
} else {
  new CronJob(process.env.CRON_TIME, function () {
    bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Приложение Simon`s Cat Parser перезапустилось')
    Simons.getYoutube()
  }, null, true, 'America/Los_Angeles')
}

console.log('Server Simon`s Cat Parser restarted')
bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Server Simon`s Cat Parser restarted')
