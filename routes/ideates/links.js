const express = require('express')
const router = express.Router()
const Link = require('../../models/ideate/link')



//All Ideas Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.title != null && req.query.title !== '') {
        searchOptions.title = new RegExp(req.query.title, 'i')
    }
    try {
        const links = await Link.find(searchOptions)
        res.render('ideates/links/index', { 
            links: links, 
            searchOptions: req.query })
    } catch {
        res.redirect('/')
    }  
    // res.render('ideates/notes/index')
})

//New Ideas Route
router.get('/new', (req, res) => {
    res.render('ideates/links/new', { link: new Link() })
})

//Create Idea Route
router.post('/', async (req, res) => {
    const link = new Link({
        title: req.body.title,
        description: req.body.description,
        link: req.body.link
    })
    try {
        const newLink = await link.save()
        res.redirect(`/links/${newLink.id}`)
    } catch {
        res.render('ideates/links/new', {
            link: link,
            errorMessage: 'Error creating idea'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const link = await Link.findById(req.params.id)
        // const templates = await templates.find({ idea: idea.id})
        res.render('ideates/links/show', {
            link: link
        })
    } catch {

    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const link = await Link.findById(req.params.id)
        res.render('ideates/links/edit', { link: link })
    } catch {
        res.redirect('/links')
    }
})

router.put('/:id', async (req, res) => {
    let link
    try {
        link = await Link.findById(req.params.id)
        link.title = req.body.title
        link.description = req.body.description
        link.link = req.body.link
        await link.save()
        res.redirect(`/links/${link.id}`)
    } catch {
        if (link == null) {
            res.redirect('/')
        } else{
            res.render('ideates/links/edit', {
                link: link,
                errorMessage: 'Error updating idea'
            })
        }
        
    }
})

router.delete('/:id', async (req, res) => {
    let link
    try {
        link = await Link.findById(req.params.id)
        await link.deleteOne()
        res.redirect('/links')
    } 
    catch {
        if (link == null) {
            res.redirect('/')
        } else{
            res.redirect(`/links/${link.id}`)
        }
    }
})

module.exports = router