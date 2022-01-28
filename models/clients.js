const {Schema, model} = require('mongoose')

const clientsSchema = new Schema({
    user:Object,
    registerDate: Number,
    wallet: String,
    confirmedTransactions: Array,
    balance: Number
})


module.exports = model('Accounts', clientsSchema)
