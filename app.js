const { Markup } = require('telegraf')
const Clients = require('./models/clients.js')
const mongoose = require('mongoose')
const KeyBoards = require('./buttons/buttons')
const store = require('store')
const {bot} = require('./models/bot')


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
			const rferalID = ctx?.startPayload
			store.set('rferalID', rferalID)
			try {
				const messagerID = String(ctx.update?.message?.from?.id)
				const findedClient = await Clients.find({ 'user.telegramClientID': messagerID })
				
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
