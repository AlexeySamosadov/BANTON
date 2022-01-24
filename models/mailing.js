const {Schema, model} = require('mongoose')

const mailingSchema = new Schema({
    messageDate: Date,
    email: String,
    ip: String,
})

module.exports = model('Mailing', mailingSchema)