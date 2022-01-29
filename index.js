const { Telegraf, Scenes, Markup, session} = require('telegraf')
const registartionScene = require('./scenes/registartion.js')
const balance = require('./scenes/balance.js')
const addBalanceScene = require('./scenes/addBalance.js')
const Clients = require('./models/clients.js')
const mongoose = require('mongoose')
// const express = require('express')
// const app = express()


// const BOT_TOKEN_JOBSURE_BOT = '2057352717:AAGJ-OW4_utQOfSgg93l_U29Nzy6gamaWOg';
TOKEN_TONBANK='5199205767:AAGBS3o_MKT2twHhtZjxN07XdkFWQIO3Fk4'
const bot = new Telegraf(TOKEN_TONBANK)

const stage = new Scenes.Stage([registartionScene, balance, addBalanceScene])
bot.use(session())
bot.use(stage.middleware())

bot.hears('Принять участие', ctx => ctx.scene.enter('registrationSceneWizard'))
bot.hears('Зарегистрировать кошелек еще раз', ctx => ctx.scene.enter('registrationSceneWizard'))
bot.hears('Баланс', ctx => ctx.scene.enter('balanceWizard'))
bot.hears('Вывод баланса', ctx => ctx.scene.enter('addBalanceWizard'))
bot.hears('Пополнить баланс', ctx => ctx.scene.enter('addBalanceWizard'))



async function start() {
    try {
      // const url = `mongodb+srv://alexey:1qa2ws3ed@cluster0.thlim.mongodb.net/shop`,
      const url = `mongodb+srv://alexey:1qa2ws3ed@cluster0.thlim.mongodb.net/TONBANK?retryWrites=true&w=majority`
      await mongoose.connect(url, {
        useNewUrlParser: true,
       //  useFindAndModify: false,
        useUnifiedTopology: true
      })

    //   app.listen(PORT, () => console.log(`My server is running on port ${PORT}`))
      bot.start(async(ctx) => {
        try {
            const messagerID = ctx.update?.message?.from?.id
            console.log('messagerID', messagerID); 

            const findedClient = await Clients.find({
                user:  ctx.update?.message?.chat
            })

            console.log('findedClient', findedClient)

            // Для администраторов
            if(findedClient[0]?.user?.id === messagerID && findedClient[0]?.wallet &&) {
              return await ctx.reply(
                  `${ctx.from.first_name} Здраствуйте! Уважаемый админ BANKTON:
                    Выберете пункты меню:`, Markup.keyboard([
                      ['Пополнить баланс','Баланс'],
                      ['Проиндексировать балансы'],

                  ]
              ).oneTime().resize())
          }

            // Для зарегистрированнях пользователей
            if(findedClient[0]?.user?.id === messagerID && findedClient[0]?.wallet) {
                return await ctx.reply(
                    `${ctx.from.first_name} Здраствуйте! Добро пожаловать в BANKTON:
                      Выберете пункты меню:`, Markup.keyboard([
                        ['Пополнить баланс', 'Вывод баланса'],
                        ['Баланс', 'Потдержка'],

                    ]
                ).oneTime().resize())
            }


            // Для новых пользователей
            await ctx.reply(`Staking CAT — отправляйте TON и получайте вознаграждения из дохода нашего валидатора.

            Мы реализовали альтернативу официального стейкинга уже сейчас, только для подписчиков закрытого канала ProTON.
            
            Обратите внимание, что это не смарт-контракт номинаторов, вы отправляете TON на баланс нашего валидатора, они используются для подтверждения транзакций в блокчейне и за это начисляется доход. Читать подробнее › (https://tonblockchain.ru/p/bd477170-c6f2-4327-80f2-4cefb6e83eba)`, Markup.keyboard([
                ['Принять участие'],
                // ['Баланс', 'Вывод баланса'],
            ]).oneTime().resize())
        } catch(e){
            console.log(e)
        }
     })
    
    bot.launch()
    } catch (e) {
      console.log(e)
    }
  }

  start()

