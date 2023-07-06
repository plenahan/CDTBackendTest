const express = require('express')
const router = express.Router()
const IdeationSession = require('../../models/ideate/ideationsession')
const IdeationType = require('../../models/ideate/ideationtype')
const Prototype = require('../../models/prototype/prototype')
const Need = require('../../models/define/povstatement')
const SortBy = require('../../models/sortby')
const { now } = require('mongoose')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

//All Templates Route
router.get('/', async (req, res) => {
    const ideationTypes = await IdeationType.find({})
    const needs = await Need.find({})
    const sortby = new SortBy({ title: req.query.SortBy })
    let query = IdeationSession.find({})
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.createdBefore != null && req.query.createdBefore != '') {
        query = query.lte('createdAt', req.query.createdBefore)
    }
    if (req.query.createdAfter != null && req.query.createdAfter != '') {
        query = query.gte('createdAt', req.query.createdAfter)
    }
    if (req.query.ideationType != null && req.query.ideationType != '') {
        query = query.in('ideationType', req.query.ideationType)
    }
    if (req.query.needs != null && req.query.needs != '') {
        query = query.in('needs', req.query.needs)
    }
    if(sortby.title == 'A2Z'){
        query = query.sort( {title: 'asc'} )
    }
    else if (sortby.title == 'Z2A'){
        query = query.sort( {title: 'desc'} )
    }
    else if (sortby.title == 'New2Old'){
        query = query.sort( {createdAt: 'desc'} )
    }
    else if (sortby.title == 'Old2New') {
        query = query.sort( {createdAt: 'asc'} )
    }

    try {
        const ideationSessions = await query.exec()
        res.render('ideates/ideationsessions/index', {
            ideationSessions: ideationSessions,
            ideationTypes: ideationTypes,
            needs: needs,
            SortBy: sortby,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})


//New Template Route
router.get('/new', async (req, res) => {
    renderNewPage(res, { ideationSession: new IdeationSession(), ideationTypes: await IdeationType.find({}),  needs: await Need.find({}) })
})

//Create Template Route
router.post('/', async (req, res) => {
    const ideationSession = new IdeationSession({
        title: req.body.title,
        description: req.body.description,
        needs: req.body.needs,
        ideationType: req.body.ideationType
    })
    saveCover(ideationSession, req.body.cover)

    try {
        const newIdeationSession = await ideationSession.save()
        res.redirect(`ideationsessions/${newIdeationSession.id}`)
    } catch {
        renderNewPage(res, ideationSession, true)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const ideationSession = await IdeationSession.findById(req.params.id).populate('ideationType').populate('needs').exec()
        // const prototype = await Prototype.find({ ideaConnected: postIt.id}).limit(6).exec()
        // res.render('ideates/post-its/show', { ideationSession: ideationSession, prototypesByPostIt: prototype })
        res.render('ideates/ideationsessions/show', { ideationSession: ideationSession, needs: ideationSession.needs })
    } catch {
        res.redirect('/')
    }
})

//Edit Template Route
router.get('/:id/edit', async (req, res) => {
    try {
        const ideationSession = await IdeationSession.findById(req.params.id)
        renderEditPage(res, ideationSession)
    } catch {
        res.redirect('/')
    }
})

//Update Template Route
router.put('/:id', async (req, res) => {
    let ideationSession

    try {
        ideationSession = await IdeationSession.findById(req.params.id)
        ideationSession.title = req.body.title
        ideationSession.description = req.body.description
        ideationSession.needs = req.body.needs
        ideationSession.ideationType = req.body.ideationType
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(ideationSession, req.body.cover)
        }
        await ideationSession.save()
        res.redirect(`/ideationsessions/${ideationSession.id}`)
    } catch {
        if (ideationSession != null) {
            renderEditPage(res, ideationSession, true)
        } else {
            redirect('/')
        }
    }
})

router.delete('/:id', async (req, res) => {
    let ideationSession
    try {
        ideationSession = await IdeationSession.findById(req.params.id)
        const response = await IdeationSession.deleteOne({ _id: req.params.id })
        res.redirect('/ideationsessions')
    } catch {
        if (ideationSession == null) {
            res.redirect('/')
        } else{
            res.redirect(`/ideationsessions/${ideationSession.id}`)
        }
    }
})

async function renderNewPage(res, postIt, hasError = false) {
    renderFormPage(res, postIt, 'new', hasError)
}

async function renderEditPage(res, postIt, hasError = false) {
    renderFormPage(res, postIt, 'edit', hasError)
}

async function renderFormPage(res, postIt, form, hasError = false) {
    try {
        const ideationTypes = await IdeationType.find({})
        const needs = await Need.find({})
        const params = {
            needs: needs,
            ideationTypes: ideationTypes,
            ideationSession: postIt
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Template'
            }
            else {
                params.errorMessage = 'Error Creating Template'
            }
        }
        res.render(`ideates/ideationsessions/${form}`, params)
    } catch {
        res.redirect('/ideationsessions')
    }
}

function saveCover(postIt, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        postIt.coverImage = new Buffer.from(cover.data, 'base64')
        postIt.coverImageType = cover.type
    }
}

module.exports = router