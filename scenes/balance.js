const { Markup, Composer, Scenes } = require('telegraf')

const startStep = new Composer()
startStep.on('text', async (ctx) => {
    console.log('ctx', ctx.wizard.state)
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.userName = ctx.message.from.username 
        ctx.wizard.state.data.firstName = ctx.message.from.first_name
        ctx.wizard.state.data.lastName = ctx.message.from.last_name       
        await ctx.replyWithHTML(`Ваш баланс <b>равен</b>   \n 
        <i>Например, здесь будет описан ваш баланс</i>`)
    
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})

const resumeScene = new Scenes.WizardScene('balanceWizard', startStep)

module.exports = resumeScene