const { Markup} = require('telegraf')

class KeyBoards {
    static async startButtons(ctx) {
        return await ctx.reply(
            `Staking CAT — отправляйте TON и получайте вознаграждения из дохода нашего валидатора.

    Мы реализовали альтернативу официального стейкинга уже сейчас, только для подписчиков закрытого канала ProTON.
    
    Обратите внимание, что это не смарт-контракт номинаторов, вы отправляете TON на баланс нашего валидатора, они используются для подтверждения транзакций в блокчейне и за это начисляется доход. Читать подробнее › (https://tonblockchain.ru/p/bd477170-c6f2-4327-80f2-4cefb6e83eba)`,
            Markup.keyboard([
                ['Принять участие'],
                // ['Баланс', 'Вывод баланса'],
            ])
                .oneTime()
                .resize()
        )
    }


    static async startRegiseredUserButtons(ctx) {
        return await ctx.reply(
            `${ctx.from.first_name} Здраствуйте! Добро пожаловать в BANKTON:
                      Выберете пункты меню:`,
            Markup.keyboard([
                ['Пополнить баланс', 'Вывод баланса'],
                ['Баланс', 'Потдержка'],
            ])
                .oneTime()
                .resize()
        )
    }

    static async startAdminButtons(ctx) {
        return await ctx.reply(
            `Здраствуйте уважаемый администратор ${ctx.from.first_name}:
             Выберете пункты меню:`,
            Markup.keyboard([
                ['Пополнить баланс', 'Вывод баланса'],
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
}



module.exports = KeyBoards
