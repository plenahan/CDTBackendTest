const express = require('express')
const router = express.Router()
const Template = require('../models/template')
const Idea = require('../models/idea')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

//All Templates Route
router.get('/', async (req, res) => {
    let query = Template.find({})
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.createdBefore != null && req.query.createdBefore != '') {
        query = query.lte('createdAt', req.query.createdBefore)
    }
    if (req.query.createdAfter != null && req.query.createdAfter != '') {
        query = query.gte('createdAt', req.query.createdAfter)
    }
    try {
        const templates = await query.exec()
        res.render('templates/index', {
            templates: templates,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})


//New Template Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Template())
})

//Create Template Route
router.post('/', async (req, res) => {
    const template = new Template({
        title: req.body.title,
        description: req.body.description
        // idea: req.body.idea
    })
    saveCover(template, req.body.cover)

    try {
        const newTemplate = await template.save()
        // res.redirect('books/${newBook.id}')
        res.redirect('templates')
    } catch {
        renderNewPage(res, template, true)
    }
})

async function renderNewPage(res, template, hasError = false) {
    try {
        const ideas = await Idea.find({})
        const params = {
            ideas: ideas,
            template: template
        }
        if (hasError) params.errorMessage = 'Error Creating Template'
        res.render('templates/new', params)
    } catch {
        res.redirect('/templates')
    }
}

function saveCover(template, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        template.coverImage = new Buffer.from(cover.data, 'base64')
        template.coverImageType = cover.type
    }
}

module.exports = router