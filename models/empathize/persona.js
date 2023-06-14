const mongoose = require('mongoose')

const personaSchema = new mongoose.Schema({
    name: {
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
    who: {
        type: String,
        required: true
    },
    do: {
        type: String,
        required: true
    },
    feel: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Persona', personaSchema)