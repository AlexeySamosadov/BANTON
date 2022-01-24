const {Schema, model} = require('mongoose')

const articleSchema = new Schema({
    title: String,
    date: Date,
    title2: String,
    text: String,
    listTitle: String,
    listItems: [String],
    list2Tittle: String,
    list2items: [String],
    bgImageUrl: String,
    imageUrl: String,
    // articles: [{
    //     type: Object,
    //     required: false
    // }],
    // user: {
    //     name: String,
    //     userId: {
    //         type: Schema.Types.ObjectId,
    //         ref: 'User',
    //         required: true
    //     }
    // },
    // date: {
    //     type: Date,
    //     default: Date.now
    // }
})

module.exports = model('Article', articleSchema)