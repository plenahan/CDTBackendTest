const mongoose = require('mongoose')

const povStatementSchema = new mongoose.Schema({
    statement: {
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

module.exports = mongoose.model('POVStatement', povStatementSchema)