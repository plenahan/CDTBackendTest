const express = require('express')
const router = express.Router()
const Link = require('../../models/ideate/link')
const SortBy = require('../../models/sortby')


//All Ideas Route
router.get('/', async (req, res) => {
    const sortby = new SortBy({ title: req.query.SortBy })
    let query = Link.find({})
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
        const links = await query.exec()
        res.render('ideates/links/index', {
            links: links,
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