const mongoose = require('mongoose')

const postItSchema = new mongoose.Schema({
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
    ideaFrom: {
        type: String
    },
    priority: {
        type: Number
    },
    needConnected: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'POVStatement'
    },
    prototypeConnected: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prototype'
    },
    keyword: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Keyword'
    }
})
postItSchema.virtual('coverImagePath').get(function(){
    if(this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Post-it', postItSchema)