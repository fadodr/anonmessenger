const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    reply: {
        type: String,
    },
    answered: {
        type: Boolean,
        default : false
    },
    timeplaced: {
        type: Date,
        default: new Date(new Date().getTime())
    }
});

module.exports = mongoose.model('Message', schema);