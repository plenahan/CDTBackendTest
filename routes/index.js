const express = require('express')
const router = express.Router()
const Template = require('../models/template')

router.get('/', async (req, res) => {
    let templates
    try {
        templates = await Template.find().sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
        templates = []
    }
    res.render('index', { templates: templates })
})

module.exports = router