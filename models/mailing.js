const {Schema, model} = require('mongoose')

const mailingSchema = new Schema({
    user:Object,
    registerDate: Number,
    wallet: String
})

module.exports = model('Mailing', mailingSchema)
