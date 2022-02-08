const { Markup} = require('telegraf')
const { Keyboard } = require('telegram-keyboard')

class KeyBoards {
    static async startButtons(ctx) {
        return await ctx.replyWithHTML(
            `  <b>TonBank</b>- отправляете криптовалюту TON и получаете проценты от валидатора. \n` +  '\n' +
            '  <i>Официальный стейкинг, только для наших подписчиков.</i>',
            Markup.keyboard([
                ['Принять участие'],
            ])
                .oneTime()
                .resize()
        )
    }


    static async startRegiseredUserButtons(ctx) {
        const keyboard = Keyboard.make([
            ['Пополнить баланс', 'Вывод средств'], // First row
            ['Баланс', 'Потдержка'], // Second row
          ])


        return await ctx.replyWithHTML(
            `<b><i>${ctx.from.first_name}</i></b>, Здраствуйте!` +
             '\n Добро пожаловать в <b>TONBANK</b>: \n Выберете пункты меню:',
             keyboard.reply())
        //     Markup.keyboard([
        //         ['Пополнить баланс', 'Вывод средств'],
        //         ['Баланс', 'Потдержка'],
        //     ])
        //         .oneTime()
        //         .resize()
        // )
    }

    static  startRegUserButtons() {
        return  
            Markup.keyboard([
                ['Пополнить баланс', 'Вывод средств'],
                ['Баланс', 'Потдержка'],
            ])
                .oneTime()
                .resize()
        
    }

    static async startAdminButtons(ctx) {
        return await ctx.reply(
            `Здраствуйте уважаемый администратор ${ctx.from.first_name}:
             Выберете пункты меню:`,
            Markup.keyboard([
                ['Пополнить баланс', 'Вывод средств'],
                ['Баланс', 'Заявки на вывод'],
                ['Проиндексировать балансы'],
            ])
                .oneTime()
                .resize()
        )
    }

    static async confirmBalanceButton(ctx) {
        return await ctx.reply(
            `${ctx.from.first_name} После перевода TON, нажмите кнопку "Подтвердить зачисление" для зачисления на ваш счет`,
            Markup.keyboard([
                ['Подтвердить зачисление'],
            ])
                .oneTime()
                .resize()
        )
    }
    static async extiButton(ctx) {
        return await ctx.reply(
            `Балансы проиндексированы:
            Чтобы двигаться дальше нажмите выйти из меню`,
            Markup.keyboard([
                ['Выйти из меню'],
            ])
                .oneTime()
                .resize()
        )
    }
    static async exit(ctx)  {
        return await ctx.reply(
            `Ключ подтверждения - номер кошелька`,
            Markup.keyboard([
                ['Выйти'],
            ])
                .oneTime()
                .resize()
        )
    }
}



module.exports = KeyBoards
