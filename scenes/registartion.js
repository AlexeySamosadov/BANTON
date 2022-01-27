const { Markup, Composer, Scenes } = require('telegraf')
const Clients = require('./../models/clients.js')

const startStep = new Composer()
startStep.on('text', async (ctx) => {
    try {
        // Если нужно чтото жобавить и пробросить на следующий этап
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.userName = ctx.message.from.username 
        ctx.wizard.state.data.firstName = ctx.message.from.first_name
        ctx.wizard.state.data.lastName = ctx.message.from.last_name
        ctx.wizard.state.data.telegramClientID = ctx.message.from.id

        await ctx.replyWithHTML(`${ctx.from.first_name}
        Для созания аккаунта укажите пожалуйста ваш TON кошелек
        Сделайте перевод только с <b><a href="http://ton.sh/address/EQC37faknSAl9Uc1ccqcbA9jpBSXSIR9j8yncIDtHr41eUvc">указанного вами Кошелька</a></b>.

        Также вы можете отправить TON вручную на этот адрес: 
        <i>EQC37faknSAl9Uc1ccqcbA9jpBSXSIR9j8yncIDtHr41eUvc</i>
        
        Минимальный объём транзакции <b>10 TON</b>.
        <i>ВАЖНО!</i> Для перевода используйте только личные кошельки из <b>Tonkeeper</> или <b>TON Wallet</>.
    `)  

    
      
        
      
    
        await ctx.reply('Укажите ваш кошелек пожалуйста', 
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

const MAIN_WALLET = 'EQC37faknSAl9Uc1ccqcbA9jpBSXSIR9j8yncIDtHr41eUvc';

const titleStep = new Composer()
titleStep.on('text', async (ctx) => {
    console.log('ctx.update.message.chat', ctx.update.message.chat)
    console.log('ctx.update.message.date', ctx.update.message.date)
    console.log('ctx.wizard.state.data', ctx.wizard.state.data)

    
    // Проверка на длину кошелька
    if(ctx.message.text.length === MAIN_WALLET.length) {
        try {
            const findedByWalletClient = await Clients.find({
                wallet: ctx.update.message.text,
            })

            console.log('findedByWalletClient', findedByWalletClient.length)
            // Проверка на существующий кошелек
            if(findedByWalletClient.length >= 1) {
                await ctx.replyWithHTML(`Такой кошелек уже зарегистрирован в системе \n <i>Укажите, пожалуйста другой кошелек</i>`)
                return 
            }

            const client = await new Clients({
                user: ctx.wizard.state.data,
                registerDate: ctx.update.message.date,
                wallet: ctx.update.message.text,
                balance: 0,
            })

            await client.save()            

            const findedClient = await Clients.find({
                user:  ctx.wizard.state.data,
                registerDate: ctx.update.message.date
            })
            console.log('findedClient', findedClient[0]?.wallet); 


            await ctx.replyWithHTML(`Вы успешно зарегистрированы <b>ваш кошелек </b> \n <i>${findedClient[0]?.wallet}</i>`,
                
            )
            return;
        } catch (e) {
        console.log(e)
        }
    }
        // Если нужно чтото жобавить и пробросить на следующий этап
        // ctx.wizard.state.data = {}
        // ctx.wizard.state.data.wallet = ctx.message.text          
         ctx.replyWithHTML('Вы непраильно указали кошелек, введите <b>заново </b><i>пожалуйста</i>',
        Markup.keyboard([
            ['Зарегистрировать кошелек еще раз']
        ]).oneTime().resize()
        )
        // return
        // return ctx.wizard.next()
   
})


   
          

const registartionScene = new Scenes.WizardScene('registrationSceneWizard', startStep, titleStep)
module.exports = registartionScene