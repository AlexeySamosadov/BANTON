const {Schema, model} = require('mongoose')

const clientsSchema = new Schema({
    user:Object,
    registerDate: Number,
    wallet: String
})

module.exports = model('Accounts', clientsSchema)
