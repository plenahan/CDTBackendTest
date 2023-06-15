const mongoose = require('mongoose')
const PostIt = require('../ideate/post-it')

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

povStatementSchema.pre('deleteOne', async function(next) {
    try {
        const query = this.getFilter()
        const hasIdea = await PostIt.exists({ needConnected: query._id })
        if (hasIdea) {
            next(new Error('This POV statement still has Design Ideas.'))
        } else {
            next()
        }
    } catch (err) {
        next(err)
    }
})

module.exports = mongoose.model('POVStatement', povStatementSchema)