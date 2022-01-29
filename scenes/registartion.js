const { Markup, Composer, Scenes } = require('telegraf')
const KeyBoards = require('../buttons/buttons')
const Clients = require('./../models/clients.js')

const startStep = new Composer()
startStep.on('text', async (ctx) => {
	try {
		// Если нужно чтото добавить и пробросить на следующий этап
		ctx.wizard.state.data = {}
		ctx.wizard.state.data.userName = ctx.message.from.username
		ctx.wizard.state.data.firstName = ctx.message.from.first_name
		ctx.wizard.state.data.lastName = ctx.message.from.last_name
		ctx.wizard.state.data.telegramClientID = String(ctx.message.from.id)

		await ctx.reply(
			'Укажите ваш кошелек пожалуйста'
			// Markup.markdown().urlButton('Отправить средсва', 'http://ton.sh/address/EQC37faknSAl9Uc1ccqcbA9jpBSXSIR9j8yncIDtHr41eUvc')
			//  Markup.keyboard([
			//     ['Принять участие'],
			//     ['Разместить резюме', 'Пополнить баланс'],
			// ]).oneTime().resize()
		)
		return ctx.wizard.next()
	} catch (e) {
		console.log(e)
	}
})

const MAIN_WALLET = 'EQC37faknSAl9Uc1ccqcbA9jpBSXSIR9j8yncIDtHr41eUvc'

const titleStep = new Composer()
titleStep.on('text', async (ctx) => {
	// Проверка на длину кошелька
	if (ctx.message.text.length === MAIN_WALLET.length) {
		try {
			const findedByWalletClient = await Clients.find({
				wallet: ctx.update.message.text,
			})

			// Проверка на существующий кошелек
			if (findedByWalletClient.length >= 1) {
				await ctx.replyWithHTML(
					`Такой кошелек уже зарегистрирован в системе \n <i>Укажите, пожалуйста другой кошелек</i>`
				)
				return
			}

			const client = await new Clients({
				user: ctx.wizard.state.data,
				registerDate: ctx.update.message.date,
				wallet: ctx.update.message.text,
				confirmedTransactions: [],
				balance: 0,
			})
			console.log('client', client)
			await client.save()

			const findedClient = await Clients.find({
				user: ctx.wizard.state.data,
				registerDate: ctx.update.message.date,
			})
			await ctx.replyWithHTML(`Вы успешно зарегистрированы <b>ваш кошелек </b> \n <i>${findedClient[0]?.wallet}</i>`)
			await KeyBoards.startButtons(ctx)
			return ctx.scene.leave()
		} catch (e) {
			console.log(e)
		}
	}
	// Если нужно чтото жобавить и пробросить на следующий этап
	// ctx.wizard.state.data = {}
	// ctx.wizard.state.data.wallet = ctx.message.text
	ctx.replyWithHTML(
		'Вы неправильно указали кошелек, нажмите кнопку \n <b>"Зарегистрировать кошелек еще раз"</b>',
		Markup.keyboard([['Зарегистрировать кошелек еще раз']])
			.oneTime()
			.resize()
	)
	return ctx.scene.leave()
})

const registartionScene = new Scenes.WizardScene('registrationSceneWizard', startStep, titleStep)
module.exports = registartionScene
