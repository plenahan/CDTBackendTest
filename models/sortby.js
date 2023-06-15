const mongoose = require('mongoose')

const sortBySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: 'Old2New'
    }
})

module.exports = mongoose.model('SortBy', sortBySchema)