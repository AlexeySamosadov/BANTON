const { Markup, Composer, Scenes } = require('telegraf')
const Clients = require('../models/clients')
const store = require('store')
const { BUTTONS } = require('../utils/utils')
const KeyBoards = require('../buttons/buttons')

const startStep = new Composer()
startStep.on('text', async (ctx) => {
	try {
		const messagerID = String(ctx.update?.message?.from?.id)
		const findedClient = await Clients.findOne({ 'user.telegramClientID': messagerID })
		const differentBalance = findedClient.balanceWithPercent
			? findedClient.balanceWithPercent - findedClient.balance
			: 0

		await ctx.replyWithHTML(
			findedClient.balanceWithPercent ?  `На вашем <b>счёте</b>:
			<i> ${findedClient.balanceWithPercent  / 1000000000 +  TON}'</i>
			` : ``  + 
		` Ваш вклад равен <b>равен</b>:
		 <i>${findedClient.balance / 1000000000 + ' TON'}</i>
		Доступно для <b>вывода</b>(в разделе вывод средств):
		 <i>${differentBalance / 1000000000 + ' TON'}</i>`,
			Markup.keyboard([[BUTTONS.percent, BUTTONS.stake],[BUTTONS.cancel]])
				.oneTime()
				.resize()
		)

		return ctx.wizard.next()
	} catch (e) {
		console.log(e)
	}
})
const secondStep = new Composer()

secondStep.on('text', async (ctx) => {
	if((ctx.message.text === BUTTONS.cancel)) {
		 await KeyBoards.startRegiseredUserButtons(ctx);
		return ctx.scene.leave()
	}
	if (ctx.message.text === BUTTONS.percent) {
		await ctx.reply(
			`Вы точно хотите вывести проценты?`,
			Markup.keyboard([[BUTTONS.confirmPercent, BUTTONS.cancel]])
				.oneTime()
				.resize()
		)

		return ctx.wizard.next()
	}
	if (ctx.message.text === BUTTONS.stake) {
		await ctx.reply(
			`Вы точно хотите вывести весь ваш вклад?`,
			Markup.keyboard([[BUTTONS.confirmBalance, BUTTONS.cancel]])
				.oneTime()
				.resize()
		)
		return ctx.wizard.next()
	}
	return ctx.scene.leave()
})

const thirdStep = new Composer()

thirdStep.on('text', async (ctx) => {
	if (ctx.message.text === BUTTONS.confirmBalance) {
		const messagerID = String(ctx.update?.message?.from?.id)
		const findedClient = await Clients.findOne({ 'user.telegramClientID': messagerID })

		if(!findedClient.balance) {
			await ctx.replyWithHTML(
				`Недостаточно средств для вывода 
				<strong>Баланс равен: 0 TON</strong>`
			)
			return ctx.scene.leave()
		}
		await ctx.replyWithHTML(
			`Чтобы вывести весь вклад, напишите в личные сообщения @AlexeySamosadov,
				<strong> Внимание! комиссия за вывод средств составляет 10%</strong>`
		)
	}
	if (ctx.message.text === BUTTONS.confirmPercent) {
		const messagerID = String(ctx.update?.message?.from?.id)
		const findedClient = await Clients.findOne({ 'user.telegramClientID': messagerID })
		if(!findedClient.balanceWithPercent || findedClient.balanceWithPercent === 0) {
			await ctx.replyWithHTML(
				`Недостаточно средств для вывода 
				<strong>Баланс процентов равен: ${findedClient.balanceWithPercent ? findedClient.balanceWithPercent : 0 }</strong>`
			)
			return ctx.scene.leave()
		}
		findedClient.withdraw = true
		await findedClient.save()
		await ctx.telegram.sendMessage(192816064,"Появилась заявка на вывод средств")
		await ctx.telegram.sendMessage(310105867,"Все работать хорошо, тебе приходить рассылка постоянно")
		await ctx.replyWithHTML(
			`Ваша заявка на вывод процентов оформлена, 
				<strong>Ожидайте вывод в течение 24 часов </strong>`
		)
	}
	return ctx.scene.leave()
})

const resumeScene = new Scenes.WizardScene('withdrawBalanceWizard', startStep, secondStep, thirdStep)

module.exports = resumeScene
