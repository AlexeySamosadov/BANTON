const { Markup, Composer, Scenes } = require('telegraf')
const Clients = require('../models/clients')
const store = require('store')
const KeyBoards = require('../buttons/buttons')

const startStep = new Composer()
startStep.on('text', async (ctx) => {
	try {
		const messengerName = String(ctx.update?.message?.from?.first_name)
		const Keyboard = Markup.keyboard([
			['Пополнить баланс', 'Вывод средств'],
			['Баланс', 'Поддержка'],
		])
			.oneTime()
			.resize()
		
		await ctx.replyWithHTML(
			  `<b>${messengerName}</b>, для получения помощи напишите <a href="https://t.me/AlexeySamosadov">сюда</a> `, 
			  Keyboard
		)

		return ctx.scene.leave()
	} catch (e) {
		console.log(e)
	}
})

const resumeScene = new Scenes.WizardScene('helpWizard', startStep)

module.exports = resumeScene
