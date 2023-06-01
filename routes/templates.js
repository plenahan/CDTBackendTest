const express = require('express')
const router = express.Router()
const Template = require('../models/template')
const Idea = require('../models/idea')
const { now } = require('mongoose')
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
        res.redirect(`templates/${newTemplate.id}`)
    } catch {
        renderNewPage(res, template, true)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const template = await Template.findById(req.params.id)
        res.render('templates/show', { template: template })
    } catch {
        res.redirect('/')
    }
})

//Edit Template Route
router.get('/:id/edit', async (req, res) => {
    try {
        const template = await Template.findById(req.params.id)
        renderEditPage(res, template)
    } catch {
        res.redirect('/')
    }
    renderEditPage(res, )
})

//Update Template Route
router.put('/:id', async (req, res) => {
    let template

    try {
        template = await Template.findById(req.params.id)
        template.title = req.body.title
        template.description = req.body.description
        template.lastUpdated = new Date()
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(template, req.body.cover)
        }
        await template.save()
        res.redirect(`/templates/${template.id}`)
    } catch(err) {
        console.log(err)
        if (template != null) {
            renderEditPage(res, template, true)
        } else {
            redirect('/')
        }
    }
})

router.delete('/:id', async (req, res) => {
    let template
    try {
        template = await Template.findById(req.params.id)
        await template.deleteOne()
        res.redirect('/templates')
    } catch {
        if(template != null) {
            res.render('templates/show', {
                template: template,
                errorMessage: 'Could not remove book'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, template, hasError = false) {
    renderFormPage(res, template, 'new', hasError)
}

async function renderEditPage(res, template, hasError = false) {
    renderFormPage(res, template, 'edit', hasError)
}

async function renderFormPage(res, template, form, hasError = false) {
    try {
        const ideas = await Idea.find({})
        const params = {
            ideas: ideas,
            template: template
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Template'
            }
            else {
                params.errorMessage = 'Error Creating Template'
            }
        }
        res.render(`templates/${form}`, params)
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