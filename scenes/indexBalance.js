const { Markup, Composer, Scenes } = require('telegraf')
const axios = require('axios')
const Clients = require('../models/clients')
const KeyBoards = require('../buttons/buttons')

const firstStep = new Composer()
firstStep.on('text', async (ctx) => {
	await ctx.replyWithHTML(`${ctx.from.first_name}
		    Сдесь будет сервис начисления балансов для пользователей:
			Сдесь нужно будет указать ежедневный процент для начисления минус наши 10%;
		`)
	return ctx.wizard.next()
})

const secondStep = new Composer()
secondStep.on('text', async (ctx) => {
	try {
		const messagerID = String(ctx.update?.message?.from?.id)
		const findedClient = await Clients.find({ 'user.telegramClientID': messagerID })
		if(findedClient.isAdmin) {
			const allClients = await Clients.find()
			allClients.map((async (client)=>{
				if(client.balanceWithPercent && ctx?.message?.text) {
					const str = ctx.message.text.replace(/,/gi,".")
					const percent = (client.balanceWithPercent / 100) * Number(str)
					client.balanceWithPercent = client.balanceWithPercent + percent
				} else {
					client.balanceWithPercent = client.balance
				}
				await client.save()
			}))
			// Проверка на колличество предыдущих транзакий

			await KeyBoards.startAdminButtons(ctx)
		}
		return ctx.scene.leave()
	} catch (e) {
		console.log(e)
	}
})

const advertisimentScene = new Scenes.WizardScene('indexBalanceWizard', firstStep, secondStep)

module.exports = advertisimentScene
