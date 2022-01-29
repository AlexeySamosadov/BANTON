const { Telegraf, Scenes, Markup, session } = require('telegraf')
const registartionScene = require('./scenes/registartion.js')
const balance = require('./scenes/balance.js')
const addBalanceScene = require('./scenes/addBalance.js')
const indexBalanceScene = require('./scenes/indexBalance.js')
const Clients = require('./models/clients.js')
const mongoose = require('mongoose')
const KeyBoards = require('./buttons/buttons')
// const express = require('express')
// const app = express()

// const BOT_TOKEN_JOBSURE_BOT = '2057352717:AAGJ-OW4_utQOfSgg93l_U29Nzy6gamaWOg';
TOKEN_TONBANK = '5199205767:AAGBS3o_MKT2twHhtZjxN07XdkFWQIO3Fk4'
const bot = new Telegraf(TOKEN_TONBANK)

const stage = new Scenes.Stage([registartionScene, balance, addBalanceScene, indexBalanceScene])
bot.use(session())
bot.use(stage.middleware())

bot.hears('Принять участие', (ctx) => ctx.scene.enter('registrationSceneWizard'))
bot.hears('Зарегистрировать кошелек еще раз', (ctx) => ctx.scene.enter('registrationSceneWizard'))
bot.hears('Баланс', (ctx) => ctx.scene.enter('balanceWizard'))
bot.hears('Вывод баланса', (ctx) => ctx.scene.enter('addBalanceWizard'))
bot.hears('Пополнить баланс', (ctx) => ctx.scene.enter('addBalanceWizard'))
bot.hears('Проиндексировать балансы', (ctx) => ctx.scene.enter('indexBalanceWizard'))

async function start() {
	try {
		// const url = `mongodb+srv://alexey:1qa2ws3ed@cluster0.thlim.mongodb.net/shop`,
		const url = `mongodb+srv://alexey:1qa2ws3ed@cluster0.thlim.mongodb.net/TONBANK?retryWrites=true&w=majority`
		await mongoose.connect(url, {
			useNewUrlParser: true,
			//  useFindAndModify: false,
			useUnifiedTopology: true,
		})

		//   app.listen(PORT, () => console.log(`My server is running on port ${PORT}`))
		bot.start(async (ctx) => {
			try {
				const messagerID = String(ctx.update?.message?.from?.id)
				const findedClient = await Clients.find({ 'user.telegramClientID': messagerID })
				console.log(findedClient[0].isAdmin)
				// Для задминистраторов
				if (findedClient[0]?.isAdmin) {
					return KeyBoards.startAdminButtons(ctx)
			   }

				// Для зарегистрированнях пользователей
				if (findedClient[0]?.user?.telegramClientID === messagerID && findedClient[0]?.wallet) {
				 	return KeyBoards.startRegiseredUserButtons(ctx)
				}

				// Для не зарегистрированнях пользователей
				return KeyBoards.startButtons(ctx)
			} catch (e) {
				console.log(e)
			}
		})

		bot.launch()
	} catch (e) {
		console.log(e)
	}
}

start()
