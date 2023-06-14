const mongoose = require('mongoose')
const PostIt = require('../ideate/post-it')

const keywordSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true
    }
})


keywordSchema.pre('deleteOne', async function(next) {
    try {
        const query = this.getFilter()
        const hasPostIt = await PostIt.exists({ keyword: query._id })
        if (hasPostIt) {
            next(new Error('This keyword still has post-its.'))
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


module.exports = mongoose.model('Keyword', keywordSchema)