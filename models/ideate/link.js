const mongoose = require('mongoose')
const { link } = require('../../routes')
// const Template = require('../template')

const linkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Link', linkSchema)