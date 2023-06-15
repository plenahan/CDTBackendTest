const express = require('express')
const router = express.Router()
const IdeateNote = require('../../models/ideate/ideatenote')
const SortBy = require('../../models/sortby')


//All Ideas Route
router.get('/', async (req, res) => {
    const sortby = new SortBy({ title: req.query.SortBy })
    let query = IdeateNote.find({})
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.createdBefore != null && req.query.createdBefore != '') {
        query = query.lte('createdAt', req.query.createdBefore)
    }
    if (req.query.createdAfter != null && req.query.createdAfter != '') {
        query = query.gte('createdAt', req.query.createdAfter)
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
    else {
        query = query.sort( {createdAt: 'asc'} )
    }
    // if (req.query.keyword != null && req.query.keyword != '') {
    //     query = query.regex('keyword', new RegExp(req.query.keyword, 'i'))
    // }
    try {
        const ideateNotes = await query.exec()
        res.render('ideates/notes/index', {
            notes: ideateNotes,
            SortBy: sortby,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
    // res.render('ideates/notes/index')
})

//New Ideas Route
router.get('/new', (req, res) => {
    res.render('ideates/notes/new', { note: new IdeateNote() })
})

//Create Idea Route
router.post('/', async (req, res) => {
    const note = new IdeateNote({
        title: req.body.title,
        description: req.body.description
    })
    try {
        const newNote = await note.save()
        res.redirect(`/ideatenotes/${newNote.id}`)
    } catch {
        res.render('ideates/notes/new', {
            note: note,
            errorMessage: 'Error creating idea'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const note = await IdeateNote.findById(req.params.id)
        // const templates = await templates.find({ idea: idea.id})
        res.render('ideates/notes/show', {
            note: note
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const note = await IdeateNote.findById(req.params.id)
        res.render('ideates/notes/edit', { note: note })
    } catch {
        res.redirect('/ideatenotes')
    }
})

router.put('/:id', async (req, res) => {
    let note
    try {
        note = await IdeateNote.findById(req.params.id)
        note.title = req.body.title
        note.description = req.body.description
        await note.save()
        res.redirect(`/ideatenotes/${note.id}`)
    } catch {
        if (note == null) {
            res.redirect('/')
        } else{
            res.render('ideates/notes/edit', {
                note: note,
                errorMessage: 'Error updating idea'
            })
        }
        
    }
})

router.delete('/:id', async (req, res) => {
    let note
    try {
        note = await IdeateNote.findById(req.params.id)
        await note.deleteOne()
        res.redirect('/ideatenotes')
    } 
    catch {
        if (note == null) {
            res.redirect('/')
        } else{
            res.redirect(`/ideatenotes/${note.id}`)
        }
    }
})

module.exports = router