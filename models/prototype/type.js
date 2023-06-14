const mongoose = require('mongoose')
const Prototype = require('./prototype')

const typeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }
})


typeSchema.pre('deleteOne', async function(next) {
    try {
        const query = this.getFilter()
        const hasPrototype = await Prototype.exists({ type: query._id })
        if (hasPrototype) {
            next(new Error('This type still has prototypes.'))
        } else {
            next()
        }
    } catch (err) {
        next(err)
    }
})


module.exports = mongoose.model('Type', typeSchema)