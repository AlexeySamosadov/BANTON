const { Markup, Composer, Scenes } = require('telegraf')
const Clients = require('../models/clients')
const store = require('store')
const KeyBoards = require('../buttons/buttons')

const startStep = new Composer()
startStep.on('text', async (ctx) => {
	const refID = store.get('rferalID')
	console.log('refID', refID)
	try {
		const messagerID = String(ctx.update?.message?.from?.id)
		const findedClient = await Clients.findOne({ 'user.telegramClientID': messagerID })

		const differentBalance = findedClient.balanceWithPercent
			? findedClient.balanceWithPercent - findedClient.balance
			: 0
		ctx.wizard.state.data = {}
		ctx.wizard.state.data.userName = ctx.message.from.username
		ctx.wizard.state.data.firstName = ctx.message.from.first_name
		ctx.wizard.state.data.lastName = ctx.message.from.last_name
		await ctx.replyWithHTML(
			findedClient.balanceWithPercent ?  `На вашем <b>счёте</b>:
			<i> ${findedClient.balanceWithPercent  / 1000000000 +  TON}'</i>
			` : ``  + 
		` Ваш вклад равен <b>равен</b>:
		 <i>${findedClient.balance / 1000000000 + ' TON'}</i>
		Доступно для <b>вывода</b>(в разделе вывод средств):
		 <i>${differentBalance / 1000000000 + ' TON'}</i>`, Markup.keyboard([
			['Пополнить баланс', 'Вывод средств'],
			['Баланс', 'Потдержка'],
		])
			.oneTime()
			.resize()
		)

		return ctx.scene.leave()
	} catch (e) {
		console.log(e)
	}
})

const resumeScene = new Scenes.WizardScene('balanceWizard', startStep)

module.exports = resumeScene
