const { Markup, Composer, Scenes } = require('telegraf')
const axios = require('axios')

// Запросы на TON чтобы получить информацию по конкрентной транзаки
const WALLET_ADDRESS = 'EQC37faknSAl9Uc1ccqcbA9jpBSXSIR9j8yncIDtHr41eUvc'
const TRANSACTION_TIME = '24794687000001'
const TRANSACTION_HASH = 'k3fg13W4L4tFG2/tjLHCWC6qXAJfnXwAb1W342X9XVY'


// Тестовые не работают:
// const WALLET_ADDRESS = 'EQC-8zBcr2d12_9tlR04qPlPUJsYtJ7kFgDLjLidqL3S0HzL'
// const TRANSACTION_TIME = '25000784000001'
// const TRANSACTION_HASH = 'Wl7k4QNdTWkBzonDzuy4npu3/1q/ghr1IYjiYqdWEuk='



const getMainWalletTransactions = async () => {
  try {
    return await axios.get(`https://api.ton.sh/getTransactions?address=${WALLET_ADDRESS}&lt=${TRANSACTION_TIME}&hash=${TRANSACTION_HASH}=&limit=1`)
  } catch (error) {
    console.error(error)
  }
}
const countTransactions = async () => {
  const breeds = await getMainWalletTransactions()
  console.log('breeds', breeds.data)
  if (breeds.data.result) {
    console.log(`Got ${Object.entries(breeds.data.result).length} transactions`)
  }
}

const startStep = new Composer()
startStep.on('text', async (ctx) => {
    countTransactions()

    
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.userName = ctx.message.from.username 
        ctx.wizard.state.data.firstName = ctx.message.from.first_name
        ctx.wizard.state.data.lastName = ctx.message.from.last_name       
        await ctx.replyWithHTML("Баланс <b>специалиста</b> вы ищите? \n <i>Например, например менеджер по продаже автомобилей</i>")
    
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})


const advertisimentScene = new Scenes.WizardScene('addBalanceWizard', startStep)

module.exports = advertisimentScene