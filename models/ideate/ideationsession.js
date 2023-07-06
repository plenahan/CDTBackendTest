const mongoose = require('mongoose')
const Prototype = require('../prototype/prototype')

const ideationSessionSchema = new mongoose.Schema({
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
    needs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'POVStatement'
    }],
    ideationType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'IdeationType'
    }
})
ideationSessionSchema.virtual('coverImagePath').get(function(){
    if(this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

// ideationSessionSchema.pre('deleteOne', async function(next) {
//     try {
//         const query = this.getFilter()
//         const hasPrototype = await Prototype.exists({ ideaConnected: query._id })
//         if (hasPrototype) {
//             next(new Error('This idea still has prototypes.'))
//         } else {
//             next()
//         }
//     } catch (err) {
//         next(err)
//     }
// })

module.exports = mongoose.model('IdeationSession', ideationSessionSchema)