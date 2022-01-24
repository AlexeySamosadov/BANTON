const express = require('express')
require('dotenv').config()
const { Bot } = require('grammy')
const { Menu } = require("@grammyjs/menu");

const mongoose = require('mongoose')
const app = express()

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
.text("Меню война?", (ctx) => ctx.reply(`Ты сделала правильный выбор ${ctx.from.first_name}! Ответь кто ты?`, { reply_markup: mainMenu })).row()
.text("Другой раздел", (ctx) => ctx.reply(`Ты ${ctx.from.first_name}! Пока делается!`))
// .text("Yfpfn", (ctx) => ctx.menu.nav()) // Добавляет меню - работает криво


// .submenu("varior-menu", (ctx) => ctx.reply(`Ты сделала правильный выбор ${ctx.from.first_name}! Ответь кто ты?`, { reply_markup: mainMenu })  );
 

const menu = new Menu("root-menu")
  .text("Сергей", (ctx) => {  
        console.log('Запрос на сергея', ctx.from)
      return ctx.reply(`Ты ${ctx.from.first_name}! А ергей Воин!`)
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
    console.log('Мегатрон', ctx.from)

    return await ctx.reply(`Нет ${ctx.from.first_name} - Ты Оптимус Балабол!`)
    }).row()
//   .text("Назат", async (ctx) => await ctx.menu.nav())
//   .back("Назат");


// const menuMiddleware = new MenuMiddleware('/', menuTemplate)
// bot.command('start', ctx => menuMiddleware.replyToContext(ctx))


bot.use(menu)
bot.use(mainMenu)

bot.command("start", async (ctx) => {
    // Send the menu.
    await ctx.reply("Кто ты воин?", { reply_markup: mainMenu });
  });
bot.command("menu", async (ctx) => {
    // Send the menu.
    await ctx.reply("А ответька еще раз :)", { reply_markup: mainMenu });
  });

// Вот пример как с моделями работать  это все хранится в файле модели
// const {Mailing} = require('/models/mailing') какаято хрень с импотрами все перенес сюда
const {Schema, model} = require('mongoose')
const mailingSchema = new Schema({
    messageDate: Date,
    email: String,
    ip: String,
})



// Как пользоваться моделями это лежит в контроллере
// const mailing = new Mailing(title, price, img); Тут обязательные пропсы
const Mailing = model('Mailing', mailingSchema)
// const mail = new Mailing({
//   messageDate: new Date(),     // это пример с пропсами
//   email: req.body.email,
//   ip: getClientAddress(req),
// })
const mailing = new Mailing(); // Тут я их убрал чтобы не ругался - это тоже самое

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


// Тут тот же бот но сделат не Telegraff!!

// const express = require('express')
// const { PORT, TOKEN } =  require('./config.js')
// const { Telegraf } = require('telegraf')
// const Markup = require('telegraf')

// const {M} = require('./keyboards')

// console.log('Markup',  Markup.Markup )

// const app = express()
// const bot = new Telegraf(TOKEN)
// // const menu = () => {
// //     return new Markup.Markup.Markup((m) =>
// //         m.inlineKeyboard([
// //           [
// //             m.callbackButton('Press 0', '0'),
// //             m.callbackButton('Press 1', '1')
// //           ]
// //         ])
// //       )
// //   };

// const getMainMenu = () => {
//     return M.keyboard.reply([['Серега'], ['Дашка', 'Волшебник']])
// }
    


// bot.start(ctx => {
//     ctx.replyWithHTML(
//         'Скажи мне <b>Кто ты Воин?</b>\n\n'+
//         'Желательно сделать правильный выбор и не ошибиться.',
//         getMainMenu())
// })

// // bot.start(ctx => {
// //     ctx.reply('Кто ты Воин?', getMainMenu())
// // })

// // bot.on('text', ctx => {
// //     ctx.reply('just text')
// // })

// // bot.on('voice', ctx => {
// //     ctx.reply('Какой чудный голос')
// // })

// // bot.on('sticker', ctx => {
// //     ctx.reply('Прикольный стикер')
// // })

// // bot.on('edited_message', ctx => {
// //     ctx.reply('Вы успешно изменили сообщение')
// // })

// // bot.hears('хочу есть сладкое', ctx => {
// //     ctx.reply('Так передохни и покушай')
// // })

// bot.hears('хочу', ctx => {
//     ctx.reply('Так передохни и вздрочни')
// })

// bot.hears('Серега', ctx => {
//     ctx.reply('Ну ты Воин!')
// })


// bot.hears('Дашка', ctx => {
//     ctx.reply('Таракашка!')
// })

// bot.hears('Волшебник', ctx => {
//     console.log('ff', ctx.telegram)
//     ctx.replyWithPhoto(
//         'http://risovach.ru/upload/2014/10/mem/tvoe-vyrazhenie-lica_62706348_orig_.jpeg',
//         {
//             caption: 'Волшебник он'
//         }
//     )
// })

// bot.command('time', ctx => {
//     ctx.reply(String(new Date()))
// })


// bot.launch()
// app.listen(PORT, () => console.log(`My server is running on port ${PORT}`))
