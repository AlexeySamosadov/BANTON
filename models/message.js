const {Schema, model} = require('mongoose')


const messageSchema = new Schema({
    messageDate: Date,
    name: String,
    email: String,
    telephoneNumber: String,
    text: String,
    ip: String,
})

module.exports = model('Message', messageSchema)