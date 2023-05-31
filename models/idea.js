const mongoose = require('mongoose')

const ideaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
})

module.exports = mongoose.model('Idea', ideaSchema)