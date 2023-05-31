const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Template = require('../models/template')
const uploadPath = path.join('public', Template.imageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const Idea = require('../models/idea')
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

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
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const template = new Template({
        title: req.body.title,
        coverImageName: fileName,
        description: req.body.description
    })

    try {
        const newTemplate = await template.save()
        // res.redirect('books/${newBook.id}')
        res.redirect('templates')
    } catch {
        if (template.coverImageName != null){
            removeTemplateCover(template.coverImageName)
        }
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

function removeTemplateCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

module.exports = router