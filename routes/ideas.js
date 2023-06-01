const express = require('express')
const router = express.Router()
const Idea = require('../models/idea')



//All Ideas Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.title != null && req.query.title !== '') {
        searchOptions.title = new RegExp(req.query.title, 'i')
    }
    try {
        const ideas = await Idea.find(searchOptions)
        res.render('ideas/index', { 
            ideas: ideas, 
            searchOptions: req.query })
    } catch {
        res.redirect('/')
    }   
})

//New Ideas Route
router.get('/new', (req, res) => {
    res.render('ideas/new', { idea: new Idea() })
})

//Create Idea Route
router.post('/', async (req, res) => {
    const idea = new Idea({
        title: req.body.title,
        description: req.body.description
    })
    try {
        const newIdea = await idea.save()
        res.redirect(`ideas/${newIdea.id}`)
    } catch {
        res.render('ideas/new', {
            idea: idea,
            errorMessage: 'Error creating idea'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id)
        // const templates = await templates.find({ idea: idea.id})
        res.render('ideas/show', {
            idea: idea
        })
    } catch {

    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id)
        res.render('ideas/edit', { idea: idea })
    } catch {
        res.redirect('/ideas')
    }
})

router.put('/:id', async (req, res) => {
    let idea
    try {
        idea = await Idea.findById(req.params.id)
        idea.title = req.body.title
        idea.description = req.body.description
        await idea.save()
        res.redirect(`/ideas/${idea.id}`)
    } catch {
        if (idea == null) {
            res.redirect('/')
        } else{
            res.render('ideas/edit', {
                idea: idea,
                errorMessage: 'Error updating idea'
            })
        }
        
    }
})

router.delete('/:id', async (req, res) => {
    let idea
    try {
        idea = await Idea.findById(req.params.id)
        await idea.deleteOne()
        res.redirect('/ideas')
    } 
    catch {
        if (idea == null) {
            res.redirect('/')
        } else{
            res.redirect(`/ideas/${idea.id}`)
        }
    }
})

module.exports = router