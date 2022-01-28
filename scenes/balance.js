const { Markup, Composer, Scenes } = require('telegraf')
const Clients = require('../models/clients')

const startStep = new Composer()
startStep.on('text', async (ctx) => {
	try {
		const messagerID = String(ctx.update?.message?.from?.id)
		const findedClient = await Clients.findOne({"user.telegramClientID": messagerID})

		ctx.wizard.state.data = {}
		ctx.wizard.state.data.userName = ctx.message.from.username
		ctx.wizard.state.data.firstName = ctx.message.from.first_name
		ctx.wizard.state.data.lastName = ctx.message.from.last_name
		await ctx.replyWithHTML(`Ваш баланс <b>равен</b>   \n 
        <i>${findedClient.balance / 1000000000 + " TON"}</i>`)

		return ctx.scene.leave()
	} catch (e) {
		console.log(e)
	}
})

const resumeScene = new Scenes.WizardScene('balanceWizard', startStep)

module.exports = resumeScene
