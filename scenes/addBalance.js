const { Markup, Composer, Scenes } = require('telegraf')
const axios = require('axios')
const Clients = require('../models/clients')
const KeyBoards = require('../buttons/buttons')

// Запросы на TON чтобы получить информацию по конкрентной транзаки
// Работает
const WALLET_ADDRESS = 'EQC37faknSAl9Uc1ccqcbA9jpBSXSIR9j8yncIDtHr41eUvc'
const TRANSACTION_TIME = '24794687000001'
const TRANSACTION_HASH = 'k3fg13W4L4tFG2/tjLHCWC6qXAJfnXwAb1W342X9XVY'

// Тестовые не работают:
// const WALLET_ADDRESS = 'EQC-8zBcr2d12_9tlR04qPlPUJsYtJ7kFgDLjLidqL3S0HzL'
// const TRANSACTION_TIME = '25000784000001'
// const TRANSACTION_HASH = 'Wl7k4QNdTWkBzonDzuy4npu3/1q/ghr1IYjiYqdWEuk='

const clientSaveTransaction = async (client, data) => {
	client.confirmedTransactions.push(data.data)
	client.balance = Number(client.balance) + Number(data.in_msg.value)
	await client.save()
}

const getMainWalletTransactions = async () => {
	try {
		return await axios({
			method: 'GET',
			url: `https://toncenter.com/api/v2/getTransactions`,
			params: {
				address: WALLET_ADDRESS,
				limit: 100,
			},
		})
	} catch (error) {
		console.error(error)
	}
}
const countTransactions = async () => {
	console.log('sd')
	const transactionsInfo = await getMainWalletTransactions()
	if (transactionsInfo.data.result) {
		// console.log(`Got ${Object.entries(transactionsInfo.data.result).length} transactions`)
		return transactionsInfo.data.result
	}
}

const firstStep = new Composer()

firstStep.on('text', async (ctx) => {
	const messagerID = String(ctx.update?.message?.from?.id)
	const findedClient = await Clients.findOne({ 'user.telegramClientID': messagerID })
	await ctx.replyWithHTML(`${ctx.from.first_name}
		    Для созания аккаунта укажите пожалуйста ваш TON кошелек
		    Сделайте перевод только с <b><a href="http://ton.sh/address/${findedClient?.wallet}">указанного вами Кошелька</a></b>.

		    Также вы можете отправить TON вручную на этот адрес:
		    <i>EQC37faknSAl9Uc1ccqcbA9jpBSXSIR9j8yncIDtHr41eUvc</i>

		    Минимальный объём транзакции <b>1 TON</b>.
		    <i>ВАЖНО!</i> Для перевода используйте только личные кошельки из <b>Tonkeeper</> или <b>TON Wallet</>.
		`)
	await KeyBoards.confirmBalanceButton(ctx)
	return ctx.wizard.next()
})

const secondStep = new Composer()
secondStep.on('text', async (ctx) => {
	try {
		const Keyboard = Markup.keyboard([
			['Пополнить баланс', 'Вывод средств'],
			['Баланс', 'Потдержка'],
		])
			.oneTime()
			.resize()
		const transactionsAll = await countTransactions()
		const messagerID = String(ctx.update?.message?.from?.id)
		const findedClient = await Clients.findOne({ 'user.telegramClientID': messagerID })
		const transactionsData = transactionsAll.filter((it) => it?.in_msg?.source === findedClient.wallet)

		// Проверка на колличество предыдущих транзакий
		if (transactionsData && transactionsData.length === 1) {
			const newData = transactionsData?.filter((it) => !findedClient.confirmedTransactions.some((el) => el === it.data))
			if (newData && newData.length === 1) {
				findedClient.confirmedTransactions.push(transactionsData[0].data)
				findedClient.balance = transactionsData[0].in_msg.value
				await findedClient.save()
				await ctx.reply(`Вам успешно зачисленны ${Number(transactionsData[0].in_msg.value) / 1000000000 + ' TON'}\n 
					Ваш баланс:  ${findedClient.balance / 1000000000 + ' TON'}`, Keyboard)
			} else {
				await ctx.reply('У вас нет новых транзакций', Keyboard)
				return ctx.scene.leave()
			}
		} else {
			const newData = transactionsData?.filter((it) => !findedClient.confirmedTransactions.some((el) => el === it.data))
			if (newData && newData.length === 1) {
				await clientSaveTransaction(findedClient, newData[0])
				await ctx.reply(`Вам успешно зачисленны ${Number(newData[0].in_msg.value) / 1000000000 + ' TON'}\n 
				Ваш баланс:  ${findedClient.balance / 1000000000 + ' TON'}`, Keyboard)
			} else if (newData && newData.length > 1) {
				let addTObalance = 0
				newData.map((data) => {
					addTObalance += Number(data.in_msg.value)
					findedClient.confirmedTransactions.push(data.data)
					findedClient.balance = Number(findedClient.balance) + Number(data.in_msg.value)
				})
				await findedClient.save()

				await ctx.reply(
					`Вам успешно зачисленны ${Number(addTObalance) / 1000000000 + ' TON'},  ваш баланс:  ${
						findedClient.balance / 1000000000 + ' TON'
					}`, Keyboard
				)
			} else {
				await ctx.reply('У вас нет новых транзакций', Keyboard)
				return ctx.scene.leave()
			}
		}
		return ctx.scene.leave()
	} catch (e) {
		console.log(e)
	}
})

const advertisimentScene = new Scenes.WizardScene('addBalanceWizard', firstStep, secondStep)

module.exports = advertisimentScene
