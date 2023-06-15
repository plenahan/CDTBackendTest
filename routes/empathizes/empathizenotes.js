const express = require('express')
const router = express.Router()
const EmpathizeNote = require('../../models/empathize/empathizenote')
const SortBy = require('../../models/sortby')


//All Ideas Route
router.get('/', async (req, res) => {
    const sortby = new SortBy({ title: req.query.SortBy })
    let query = EmpathizeNote.find({})
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
        const empathizeNotes = await query.exec()
        res.render('empathizes/empathizenotes/index', {
            empathizeNote: empathizeNotes,
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
    res.render('empathizes/empathizenotes/new', { empathizeNote: new EmpathizeNote() })
})

//Create Idea Route
router.post('/', async (req, res) => {
    const empathizeNote = new EmpathizeNote({
        title: req.body.title,
        description: req.body.description
    })
    try {
        const newNote = await empathizeNote.save()
        res.redirect(`/empathizenotes/${newNote.id}`)
    } catch {
        res.render('empathizes/empathizenotes/new', {
            empathizeNote: empathizeNote,
            errorMessage: 'Error creating idea'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const empathizeNote = await EmpathizeNote.findById(req.params.id)
        // const templates = await templates.find({ idea: idea.id})
        res.render('empathizes/empathizenotes/show', {
            empathizeNote: empathizeNote
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const empathizeNote = await EmpathizeNote.findById(req.params.id)
        res.render('empathizes/empathizenotes/edit', { empathizeNote: empathizeNote })
    } catch {
        res.redirect('/empathizenotes')
    }
})

router.put('/:id', async (req, res) => {
    let empathizeNote
    try {
        empathizeNote = await EmpathizeNote.findById(req.params.id)
        empathizeNote.title = req.body.title
        empathizeNote.description = req.body.description
        await empathizeNote.save()
        res.redirect(`/empathizenotes/${empathizeNote.id}`)
    } catch {
        if (empathizeNote == null) {
            res.redirect('/')
        } else{
            res.render('empathizes/empathizenotes/edit', {
                empathizeNote: empathizeNote,
                errorMessage: 'Error updating idea'
            })
        }
        
    }
})

router.delete('/:id', async (req, res) => {
    let empathizeNote
    try {
        empathizeNote = await EmpathizeNote.findById(req.params.id)
        await empathizeNote.deleteOne()
        res.redirect('/empathizenotes')
    } 
    catch {
        if (note == null) {
            res.redirect('/')
        } else{
            res.redirect(`/empathizenotes/${empathizeNote.id}`)
        }
    }
})

module.exports = router