const mongoose = require('mongoose')
const IdeationSession = require('../ideate/ideationsession')

const ideationTypeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }
})


ideationTypeSchema.pre('deleteOne', async function(next) {
    try {
        const query = this.getFilter()
        const hasIdeationSession = await IdeationSession.exists({ type: query._id })
        if (hasIdeationSession) {
            next(new Error('This type still has ideation sessions.'))
        } else {
            next()
        }
    } catch (err) {
        next(err)
    }
//   PostIt.find({ keyword: this.id }, (err, postIts) => {
//       if (err) {
//           next(err)
//       } else if (postIts.length > 0) {
//           next(new Error('This keyword has post-its still'))
//       } else {
//           next()
//       }
//   })
})


module.exports = mongoose.model('IdeationType', ideationTypeSchema)