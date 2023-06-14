const express = require('express')
const router = express.Router()
const TestNote = require('../../models/test/testnote')
const Prototype = require('../../models/prototype/prototype')



//All Ideas Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.title != null && req.query.title !== '') {
        searchOptions.title = new RegExp(req.query.title, 'i')
    }
    try {
        const testNotes = await TestNote.find(searchOptions)
        res.render('tests/testnotes/index', { 
            testNotes: testNotes, 
            searchOptions: req.query })
    } catch {
        res.redirect('/')
    }  
    // res.render('ideates/notes/index')
})

//New Ideas Route
router.get('/new', async (req, res) => {
    res.render('tests/testnotes/new', { testNote: new TestNote(), prototypes: await Prototype.find({}) })
})

//Create Idea Route
router.post('/', async (req, res) => {
    const testNote = new TestNote({
        title: req.body.title,
        description: req.body.description,
        prototypeConnected: req.body.prototypeConnected
    })
    try {
        const newTestNote = await testNote.save()
        res.redirect(`/testnotes/${newTestNote.id}`)
    } catch {
        res.render('tests/testnotes/new', {
            testNote: testNote,
            errorMessage: 'Error creating idea'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const testNote = await TestNote.findById(req.params.id).populate('prototypeConnected').exec()
        // const templates = await templates.find({ idea: idea.id})
        res.render('tests/testnotes/show', {
            testNote: testNote
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const testNote = await TestNote.findById(req.params.id)
        res.render('tests/testnotes/edit', { testNote: testNote })
    } catch {
        res.redirect('/testnotes')
    }
})

router.put('/:id', async (req, res) => {
    let testNote
    try {
        testNote = await TestNote.findById(req.params.id)
        testNote.title = req.body.title
        testNote.description = req.body.description
        testNote.prototypeConnected = req.body.prototypeConnected
        await testNote.save()
        res.redirect(`/testnotes/${testNote.id}`)
    } catch {
        if (testNote == null) {
            res.redirect('/')
        } else{
            res.render('tests/testnotes/edit', {
                testNote: testNote,
                errorMessage: 'Error updating idea'
            })
        }
        
    }
})

router.delete('/:id', async (req, res) => {
    let testNote
    try {
        testNote = await TestNote.findById(req.params.id)
        await testNote.deleteOne()
        res.redirect('/testnotes')
    } 
    catch {
        if (testNote == null) {
            res.redirect('/')
        } else{
            res.redirect(`/testnotes/${testNote.id}`)
        }
    }
})

module.exports = router