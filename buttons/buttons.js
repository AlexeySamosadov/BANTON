const { Markup} = require('telegraf')

class KeyBoards {
    static async startButtons(ctx) {
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
}



module.exports = KeyBoards
