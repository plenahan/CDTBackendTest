const mongoose = require('mongoose')
// const Template = require('../template')

const empathizeNoteSchema = new mongoose.Schema({
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
    }
})

module.exports = mongoose.model('EmpathizeNote', empathizeNoteSchema)