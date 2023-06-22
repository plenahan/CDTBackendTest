const mongoose = require('mongoose')
const TestNote = require('../test/testnote')

const prototypeSchema = new mongoose.Schema({
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
    coverImage: {
        type: Buffer,
        // required: true
    },
    coverImageType: {
        type: String,
        // required: true
    },
    purpose: {
        type: String
    },
    priority: {
        type: Number
    }, 
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type'
    },
    ideaConnected: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post-it'
    }
})
prototypeSchema.virtual('coverImagePath').get(function(){
    if(this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

prototypeSchema.pre('deleteOne', async function(next) {
    try {
        const query = this.getFilter()
        const hasTest = await TestNote.exists({ prototypeConnected: query._id })
        if (hasTest) {
            next(new Error('This prototype still has tests.'))
        } else {
            next()
        }
    } catch (err) {
        next(err)
    }
})

module.exports = mongoose.model('Prototype', prototypeSchema)