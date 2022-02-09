const { Markup, Composer, Scenes } = require('telegraf')
const Clients = require('../models/clients')
const store = require('store')
const KeyBoards = require('../buttons/buttons')

const startStep = new Composer()
startStep.on('text', async (ctx) => {
	try {
		const messengerName = String(ctx.update?.message?.from?.first_name)		
		await ctx.replyWithHTML(
			  `<b>${messengerName}</b>, для получения помощи напишите сюда в чат и мы обязательно вам ответим`
 		)

		return ctx.wizard.next()
	} catch (e) {
		console.log(e)
	}
})

const secondStep = new Composer()
secondStep.on('text', async (ctx) => {
	try {
		const messengerName = String(ctx.update?.message?.from?.first_name)
		const Keyboard = Markup.keyboard([
			['Пополнить баланс', 'Вывод средств'],
			['Баланс', 'Поддержка'],
		])
			.oneTime()
			.resize()
		const mesenger = ctx.update?.message?.from // 
		const message = ctx.update?.message?.text 		 

		await ctx.telegram.sendMessage(192816064,`Пользователь @${mesenger?.username} написал в техпотдержку со словами: 
			
			"${message}"

			Его данные :
			Имя ${mesenger?.first_name},
			Фамилия ${mesenger?.last_name},
			id: ${mesenger?.id}
			Бот или человек: ${mesenger?.is_bot ? 'Это бот' : ' Это Человек'},
			Открытый или закрытый аккаунт:  ${ctx.update?.message?.chat?.type}
		`)

		await ctx.replyWithHTML(
			`<b>${messengerName}</b>, мы получили ваше сообщение, администратор вскоре вам ответит`,
			Keyboard
	  )
		return ctx.scene.leave()
	} catch (e) {
		console.log(e)
	}
})

const resumeScene = new Scenes.WizardScene('helpWizard', startStep, secondStep)

module.exports = resumeScene
