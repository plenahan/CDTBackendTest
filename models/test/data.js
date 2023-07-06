const mongoose = require('mongoose')
// const Template = require('../template')

const dataSchema = new mongoose.Schema({
    title: {
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
    },
    file: {
        type: Buffer
      },
    metric: {
        type: String
    }
})

module.exports = mongoose.model('Data', dataSchema)