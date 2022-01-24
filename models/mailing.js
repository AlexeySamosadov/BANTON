const {Schema, model} = require('mongoose')

const mailingSchema = new Schema({user:Object})

module.exports = model('Mailing', mailingSchema)
