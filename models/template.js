const mongoose = require('mongoose')
const path = require('path')
const imageBasePath = 'uploads/templateCovers'

const templateSchema = new mongoose.Schema({
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
    coverImageName: {
        type: String,
        required: true
    },
    // author: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'Author'
    // }
})
templateSchema.virtual('coverImagePath').get(function(){
    if(this.coverImageName != null) {
        return path.join('/', imageBasePath, this.coverImageName)
    }
})

module.exports = mongoose.model('Template', templateSchema)
module.exports.imageBasePath = imageBasePath