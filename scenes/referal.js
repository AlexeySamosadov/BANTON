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
			  `${messengerName}, у нас действует реферальная система.
			  Cкопируйте ссылку, пришлите друзьям и при
			  зачислении средств за стейкинг, вы получите 5% от вложенных средств
		      друга
			   Ваша персональная ссылка: <i>https://t.me/BankTonbot="</i>`, 
			  Keyboard
		)

	// 	`${messengerName} у нас действеует реферальная система.
	// 	скопируйте ссылку для для своих друзей и при 
	
	//  `

		return ctx.scene.leave()
	} catch (e) {
		console.log(e)
	}
})

const resumeScene = new Scenes.WizardScene('referalWizard', startStep)

module.exports = resumeScene
