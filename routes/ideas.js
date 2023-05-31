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
        // res.redirect(`authors/${newAuthor.id}`)
        res.redirect('ideas')
    } catch {
        res.render('ideas/new', {
            idea: idea,
            errorMessage: 'Error creating idea'
        })
    }
})

module.exports = router