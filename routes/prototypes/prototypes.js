const express = require('express')
const router = express.Router()
const Prototype = require('../../models/prototype/prototype')
const Type = require('../../models/prototype/type')
const PostIt = require('../../models/ideate/post-it')
const TestNote = require('../../models/test/testnote')
const { now } = require('mongoose')
const SortBy = require('../../models/sortby')
// const type = require('../../models/prototype/type')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

//All Templates Route
router.get('/', async (req, res) => {
    const types = await Type.find({})
    const ideaConnected = await PostIt.find({})
    const sortby = new SortBy({ title: req.query.SortBy })
    let query = Prototype.find({})
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.createdBefore != null && req.query.createdBefore != '') {
        query = query.lte('createdAt', req.query.createdBefore)
    }
    if (req.query.createdAfter != null && req.query.createdAfter != '') {
        query = query.gte('createdAt', req.query.createdAfter)
    }
    if (req.query.type != null && req.query.type != '') {
        query = query.in('type', req.query.type)
    }
    if (req.query.ideaConnected != null && req.query.ideaConnected != '') {
        query = query.in('ideaConnected', req.query.ideaConnected)
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
    else if (sortby.title == 'HighPri') {
        query = query.sort( {priority: 'desc'} )
    }
    else {
        query = query.sort( {priority: 'asc'} )
    }

    try {
        const prototypes = await query.exec()
        res.render('prototypes/prototypes/index', {
            prototypes: prototypes,
            types: types,
            ideaConnected: ideaConnected,
            SortBy: sortby,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})


//New Template Route
router.get('/new', async (req, res) => {
    renderNewPage(res, { prototype: new Prototype(), type: await Type.find({}), ideaConnected: await PostIt.find({}) })
})

//Create Template Route
router.post('/', async (req, res) => {
    const prototype = new Prototype({
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        purpose: req.body.purpose,
        type: req.body.type,
        ideaConnected: req.body.ideaConnected
    })
    saveCover(prototype, req.body.cover)

    try {
        const newPrototype = await prototype.save()
        res.redirect(`prototypes/${newPrototype.id}`)
    } catch {
        renderNewPage(res, prototype, true)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const prototype = await Prototype.findById(req.params.id).populate('type').populate('ideaConnected').exec()
        const testNotes = await TestNote.find({ prototypeConnected: prototype.id}).limit(6).exec()
        res.render('prototypes/prototypes/show', { prototype: prototype, testNotesByPrototype: testNotes })
    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

//Edit Template Route
router.get('/:id/edit', async (req, res) => {
    try {
        const prototype = await Prototype.findById(req.params.id)
        renderEditPage(res, prototype)
    } catch {
        res.redirect('/')
    }
})

//Update Template Route
router.put('/:id', async (req, res) => {
    let prototype

    try {
        prototype = await Prototype.findById(req.params.id)
        prototype.title = req.body.title
        prototype.description = req.body.description
        prototype.purpose = req.body.purpose
        prototype.priority = req.body.priority
        prototype.type = req.body.type
        prototype.ideaConnected = req.body.ideaConnected
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(prototype, req.body.cover)
        }
        await prototype.save()
        res.redirect(`/prototypes/${prototype.id}`)
    } catch {
        if (prototype != null) {
            renderEditPage(res, prototype, true)
        } else {
            redirect('/')
        }
    }
})

router.delete('/:id', async (req, res) => {
    let prototype
    try {
        prototype = await Prototype.findById(req.params.id)
        const response = await Prototype.deleteOne({ _id: req.params.id })
        res.redirect('/prototypes')
    } catch {
        if (prototype == null) {
            res.redirect('/')
        } else{
            res.redirect(`/prototypes/${prototype.id}`)
        }
    }
})

async function renderNewPage(res, prototype, hasError = false) {
    renderFormPage(res, prototype, 'new', hasError)
}

async function renderEditPage(res, prototype, hasError = false) {
    renderFormPage(res, prototype, 'edit', hasError)
}

async function renderFormPage(res, prototype, form, hasError = false) {
    try {
        const type = await Type.find({})
        const ideaConnected = await PostIt.find({})
        const params = {
            ideaConnected: ideaConnected,
            types: type,
            prototype: prototype
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Template'
            }
            else {
                params.errorMessage = 'Error Creating Template'
            }
        }
        res.render(`prototypes/prototypes/${form}`, params)
    } catch {
        res.redirect('/prototypes')
    }
}

function saveCover(prototype, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        prototype.coverImage = new Buffer.from(cover.data, 'base64')
        prototype.coverImageType = cover.type
    }
}

module.exports = router