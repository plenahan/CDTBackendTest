const mongoose = require('mongoose')
// const Template = require('../template')

const testNoteSchema = new mongoose.Schema({
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
    prototypeConnected: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prototype' 
    }
})

module.exports = mongoose.model('TestNote', testNoteSchema)