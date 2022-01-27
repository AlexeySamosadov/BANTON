const { Markup, Composer, Scenes } = require('telegraf')

const startStep = new Composer()
startStep.on('text', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.userName = ctx.message.from.username 
        ctx.wizard.state.data.firstName = ctx.message.from.first_name
        ctx.wizard.state.data.lastName = ctx.message.from.last_name       
        await ctx.replyWithHTML(`${ctx.from.first_name}
        Для созания аккаунта укажите пожалуйста ваш TON кошелек
        Сделайте перевод только с <b>указанного вами </b>
         <a href="http://ton.sh/address/EQC37faknSAl9Uc1ccqcbA9jpBSXSIR9j8yncIDtHr41eUvc">
         Кошелька</a>.

        Также вы можете отправить TON вручную на этот адрес: 
        <i>EQC37faknSAl9Uc1ccqcbA9jpBSXSIR9j8yncIDtHr41eUvc</i>
        
        Минимальный объём транзакции <b>10 TON</b>.
        <i>ВАЖНО!</i> Для перевода используйте только личные кошельки из <b>Tonkeeper</> или <b>TON Wallet</>.
    `)  

    
      
        
      
    
        await ctx.reply('Укажите ваш кошелек пожалуйста', 
        // Markup.markdown().urlButton('Отправить средсва', 'http://ton.sh/address/EQC37faknSAl9Uc1ccqcbA9jpBSXSIR9j8yncIDtHr41eUvc')
         Markup.keyboard([
            ['Принять участие'],
            ['Разместить резюме', 'Пополнить баланс'],
        ]).oneTime().resize()
        )
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})


const titleStep = new Composer()
titleStep.on('text', async (ctx) => {
    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.title = ctx.message.text          
        await ctx.replyWithHTML('Укажите форму занятости. В каком городе требуется  <b>специалиста</b> вы ищите? \n <i>Например, москва</i>')
        return ctx.wizard.next()
    } catch (e) {
        console.log(e)
    }
})


   
          

const registartionScene = new Scenes.WizardScene('registrationSceneWizard', startStep, titleStep)
module.exports = registartionScene