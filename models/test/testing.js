const mongoose = require('mongoose')
// const Template = require('../template')

const testingSchema = new mongoose.Schema({
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
    prototypes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prototype' 
    }],
    goals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal'
    }],
    conditions: {
        type: String
    },
    data: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Data'
    },
    addressedUserNeeds: {
        type: Boolean
    }
})

module.exports = mongoose.model('Testing', testingSchema)