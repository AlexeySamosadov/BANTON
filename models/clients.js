const {Schema, model} = require('mongoose')

const clientsSchema = new Schema({
    user:Object,
    registerDate: Number,
    wallet: String,
    confirmedTransactions: Array,
    balance: Number,
    balanceWithPercent: Number,
    investedBalance: Number,
    isAdmin: Boolean
})

module.exports = model('Accounts', clientsSchema)
