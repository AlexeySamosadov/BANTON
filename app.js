const express = require('express')
require('dotenv').config()
const { Bot } = require('grammy')
const { Menu } = require("@grammyjs/menu");
const Mailing = require('./models/mailing')
const mongoose = require('mongoose')
const app = express()


// Меню из библиотеки
// const {MenuTemplate, MenuMiddleware} = require('grammy-inline-menu')
// const menuTemplate = new MenuTemplate(ctx => `Hey ${ctx.from.first_name}!`)
// menuTemplate.interact('I am excited!', 'a', {
// 	do: async ctx => {
// 		await ctx.reply('As am I!')
// 		return false
// 	}
// })

const bot = new Bot(process.env.TOKEN)
const mainMenu = new Menu("root-menu")
.text("Приянть участие", (ctx) => {
   return ctx.reply(
     `${ctx.from.first_name}
      Для созания аккаунта укажите пожалуйста ваш TON кошелек
      Сделайте перевод только с указанного вами кошелька (http://ton.sh/address/EQC37faknSAl9Uc1ccqcbA9jpBSXSIR9j8yncIDtHr41eUvc).

      Также вы можете отправить TON вручную на этот адрес: 
      EQC37faknSAl9Uc1ccqcbA9jpBSXSIR9j8yncIDtHr41eUvc   
      
      Минимальный объём транзакции 10 TON.
      ВАЖНО! Для перевода используйте только личные кошельки из Tonkeeper или TON Wallet.
      `, { reply_markup: menuSendTON }
     )
})
// .text("Создать кошелек", (ctx) => ctx.reply(`Ты сделала правильный выбор ${ctx.from.first_name}!Номер кашелька?`, { reply_markup: mainMenu })).row()
    .submenu("Баланс", "credits-pay")
// .text("Yfpfn", (ctx) => ctx.menu.nav()) // Добавляет меню - работает криво


// .submenu("varior-menu", (ctx) => ctx.reply(`Ты сделала правильный выбор ${ctx.from.first_name}! Ответь кто ты?`, { reply_markup: mainMenu })  );

const saveAsync = async (el) => {
    await el.save()
}

const menuSendTON = new Menu("send-ton")
.text("Отправить TON", (ctx) => {
   
    return ctx.reply(`${ctx.from.first_name} Здесь надо сделать ссылку 
     на телегам при нажатии на кнопку должен сразу переходить
    ton://transfer/EQC37faknSAl9Uc1ccqcbA9jpBSXSIR9j8yncIDtHr41eUvc
    `, { reply_markup: menuBack })
}).row()

const menuBack = new Menu("go-back")
.back("Назат");


const menu = new Menu("credits-pay")
  .text("Номер кошелька", (ctx) => {
        // console.log('Запрос на сергея', ctx.from)
      const mailing = new Mailing({user:ctx.from})
      // saveAsync(mailing)
      return ctx.reply(`Ты ${ctx.from.first_name}Thanks`)
     }).row()
  .text("Дашка", (ctx) => {
      console.log('Запрос на Дашку', ctx.from)
      return ctx.reply(`Ты ${ctx.from.first_name}! А Дашка таракашка!`)
    })
  .text("Волшебник", (ctx) => {
    console.log('Запрос на Волшебника', ctx.from)
    return ctx.replyWithPhoto(
    'http://risovach.ru/upload/2014/10/mem/tvoe-vyrazhenie-lica_62706348_orig_.jpeg',
    {
        caption: `Волшебник он`
    })})
  .text("Мегатрон", async (ctx) => {
    // console.log('Мегатрон', ctx.from)

    return await ctx.reply(`Нет ${ctx.from.first_name} - Ты Оптимус Балабол!`)
    }).row()
//   .text("Назат", async (ctx) => await ctx.menu.nav())
//   .back("Назат");

mainMenu.register(menu);
mainMenu.register(menuSendTON);
mainMenu.register(menuBack);

// const menuMiddleware = new MenuMiddleware('/', menuTemplate)
// bot.command('start', ctx => menuMiddleware.replyToContext(ctx))

bot.use(mainMenu)
bot.command("start", async (ctx) => {
    // Send the menu.
    await ctx.reply(
      `
      Приветсвую в  TONBANKBOT  \n
      TONBANK — отправляйте TON и получайте вознаграждения из дохода нашего валидатора. \n
       Чтобы быстро добавить задачу, просто напишите ее и отправьте боту \n` + 
       `Обратите внимание, что это не смарт-контракт номинаторов, вы отправляете TON на баланс нашего валидатора, они используются для подтверждения транзакций в блокчейне и за это начисляется доход. `,
     { reply_markup: mainMenu });

    // await ctx.replyWithHTML(
    //     'Приветсвую в <b>TaskManagerBot</b>\n\n'+
    //     'Чтобы быстро добавить задачу, просто напишите ее и отправьте боту',
    //     { reply_markup: mainMenu })
  });
bot.command("menu", async (ctx) => {
    // Send the menu.
    await ctx.reply("TonBot", { reply_markup: mainMenu });
  });





// Как пользоваться моделями это лежит в контроллере
// const mailing = new Mailing(title, price, img); Тут обязательные пропсы
// const Mailing = model('Mailing', mailingSchema)
// const mail = new Mailing({
//   messageDate: new Date(),     // это пример с пропсами
//   email: req.body.email,
//   ip: getClientAddress(req),
// })
 // Тут я их убрал чтобы не ругался - это тоже самое

// await mail.save()  // а это уже метот для сохранения и тд
// await mail.find((art => art.number === req.params.id)) // найти чтото в базе данных




async function start() {
    try {
      // const url = `mongodb+srv://alexey:1qa2ws3ed@cluster0.thlim.mongodb.net/shop`,
      const url = `mongodb+srv://alexey:1qa2ws3ed@cluster0.thlim.mongodb.net/TONBANK?retryWrites=true&w=majority`
      await mongoose.connect(url, {
        useNewUrlParser: true,
       //  useFindAndModify: false,
        useUnifiedTopology: true
      })

      app.listen(process.env.PORT, () => console.log(`My server is running on port ${process.env.PORT}`))
      bot.start();
    } catch (e) {
      console.log(e)
    }
  }

  start()

