const { Markup, Composer, Scenes } = require('telegraf')
const axios = require('axios')

const getMainWalletTransactions = async () => {
  try {
    return await axios.get('https://api.ton.sh/getTransactions?address=EQC37faknSAl9Uc1ccqcbA9jpBSXSIR9j8yncIDtHr41eUvc')
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