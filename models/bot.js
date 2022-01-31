const { Telegraf, Scenes, Markup, session } = require('telegraf')
const registartionScene = require('../scenes/registartion')
const balance = require('../scenes/balance.js')
const addBalanceScene = require('../scenes/addBalance.js')
const indexBalanceScene = require('../scenes/indexBalance.js')
const withdrawBalanceScene = require('../scenes/withdrawBalance')
const withdrawList = require('../scenes/withdrawList')

TOKEN_TONBANK = '5199205767:AAGBS3o_MKT2twHhtZjxN07XdkFWQIO3Fk4'
const bot = new Telegraf(TOKEN_TONBANK)



const stage = new Scenes.Stage([registartionScene, balance, addBalanceScene, indexBalanceScene, withdrawBalanceScene,withdrawList])
bot.use(session())
bot.use(stage.middleware())

bot.hears('Принять участие', (ctx) => ctx.scene.enter('registrationSceneWizard'))
bot.hears('Зарегистрировать кошелек еще раз', (ctx) => ctx.scene.enter('registrationSceneWizard'))
bot.hears('Баланс', (ctx) => ctx.scene.enter('balanceWizard'))
bot.hears('Вывод средств', (ctx) => ctx.scene.enter('withdrawBalanceWizard'))
bot.hears('Пополнить баланс', (ctx) => ctx.scene.enter('addBalanceWizard'))
bot.hears('Проиндексировать балансы', (ctx) => ctx.scene.enter('indexBalanceWizard'))
bot.hears('Заявки на вывод', (ctx) => ctx.scene.enter('withdrawListWizard'))




module.exports = {bot}
