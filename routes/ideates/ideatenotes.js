const express = require('express')
const router = express.Router()
const IdeateNote = require('../../models/ideate/ideatenote')



//All Ideas Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.title != null && req.query.title !== '') {
        searchOptions.title = new RegExp(req.query.title, 'i')
    }
    try {
        const notes = await IdeateNote.find(searchOptions)
        res.render('ideates/ideatenotes/index', { 
            notes: notes, 
            searchOptions: req.query })
    } catch {
        res.redirect('/')
    }  
    // res.render('ideates/notes/index')
})

//New Ideas Route
router.get('/new', (req, res) => {
    res.render('ideates/ideatenotes/new', { note: new IdeateNote() })
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
        res.render('ideates/ideatenotes/new', {
            note: note,
            errorMessage: 'Error creating idea'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const note = await IdeateNote.findById(req.params.id)
        // const templates = await templates.find({ idea: idea.id})
        res.render('ideates/ideatenotes/show', {
            note: note
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const note = await IdeateNote.findById(req.params.id)
        res.render('ideates/ideatenotes/edit', { note: note })
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
            res.render('ideates/ideatenotes/edit', {
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