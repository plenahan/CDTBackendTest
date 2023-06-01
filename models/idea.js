const mongoose = require('mongoose')
const Template = require('./template')

const ideaSchema = new mongoose.Schema({
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
    }
})


// ideaSchema.pre('deleteOne', function(next) {
//   Template.find({ idea: this.id }, (err, templates) => {
//       if (err) {
//           next(err)
//       } else if (templates.length > 0) {
//           next(new Error('This idea has templates still'))
//       } else {
//           next()
//       }
//   })
// })


module.exports = mongoose.model('Idea', ideaSchema)