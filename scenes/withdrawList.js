const { Markup, Composer, Scenes } = require('telegraf')
const Clients = require('../models/clients')
const store = require('store')
const KeyBoards = require('../buttons/buttons')

const startStep = new Composer()
startStep.on('text', async (ctx) => {
	try {
		const clients = await Clients.find({ withdraw: true })
		if (clients.length < 1) return ctx.scene.leave()
		await ctx.replyWithHTML(
			`
			${clients.map((client) => {
				const differentBalance = client.balanceWithPercent ? client.balanceWithPercent - client.balance : 0
				return `${client.wallet} - ${differentBalance / 1000000000 + ' TON' + '  '} `
			})}
			`
		)
		await KeyBoards.exit(ctx)
		return ctx.wizard.next()
	} catch (e) {
		console.log(e)
	}
})
const secondStep = new Composer()

secondStep.on('text', async (ctx) => {
	const confirmPhrase = ctx.message.text.split(' ')[0]
	const walletID = ctx.message.text.split(' ')[1]
	if (confirmPhrase === '555' && walletID.length === 48) {
		const client = await Clients.findOne({ 'wallet': walletID })
		client.withdraw = false
		client.balanceWithPercent = 0
		await client.save()
		await ctx.scene.enter('withdrawListWizard')
	}
	return ctx.scene.leave()
})

const resumeScene = new Scenes.WizardScene('withdrawListWizard', startStep, secondStep)

module.exports = resumeScene
