require('dotenv').config()
const express = require('express')
const app = express()
const CronJob = require('cron').CronJob

const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true })

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const Simons = require('./simons')(bot)

if (process.env.NODE_ENV == 'development') {
  Simons.getYoutube()
} else {
  new CronJob(process.env.CRON_TIME, function () {
    Simons.getYoutube()
  }, null, true, 'America/Los_Angeles')
}

console.log('Приложение Simon`s Cat Parser перезапустилось')
bot.sendMessage(process.env.TELEGRAM_ADMIN, 'Приложение Simon`s Cat Parser перезапустилось')
