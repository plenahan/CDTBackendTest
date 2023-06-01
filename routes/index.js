const express = require('express')
const router = express.Router()
const Template = require('../models/template')
const Idea = require('../models/idea')

router.get('/', async (req, res) => {
    let templates
    let ideas
    try {
        ideas = await Idea.find().sort({ createdAt: 'desc' }).limit(10).exec()
        templates = await Template.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
        ideas = []
        templates = []
    }
    res.render('index', { ideas: ideas, templates: templates })
})

module.exports = router