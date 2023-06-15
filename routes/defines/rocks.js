const express = require('express')
const router = express.Router()
const Rock = require('../../models/define/rock')
const SortBy = require('../../models/sortby')


//All Ideas Route
router.get('/', async (req, res) => {
    const sortby = new SortBy({ title: req.query.SortBy })
    let query = Rock.find({})
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
    try {
        const rocks = await query.exec()
        res.render('defines/rocks/index', {
            rock: rocks,
            SortBy: sortby,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

//New Ideas Route
router.get('/new', (req, res) => {
    res.render('defines/rocks/new', { rock: new Rock() })
})

//Create Idea Route
router.post('/', async (req, res) => {
    const rock = new Rock({
        title: req.body.title,
        description: req.body.description,
        bigOrLittle: req.body.bigOrLittle
    })
    try {
        const newNote = await rock.save()
        res.redirect(`/rocks/${newNote.id}`)
    } catch {
        res.render('defines/rocks/new', {
            rock: rock,
            errorMessage: 'Error creating idea'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const rock = await Rock.findById(req.params.id)
        // const templates = await templates.find({ idea: idea.id})
        res.render('defines/rocks/show', {
            rock: rock
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const rock = await Rock.findById(req.params.id)
        res.render('defines/rocks/edit', { rock: rock })
    } catch {
        res.redirect('/rocks')
    }
})

router.put('/:id', async (req, res) => {
    let rock
    try {
        rock = await Rock.findById(req.params.id)
        rock.title = req.body.title
        rock.description = req.body.description
        rock.bigOrLittle = req.body.bigOrLittle
        await rock.save()
        res.redirect(`/rocks/${rock.id}`)
    } catch {
        if (rock == null) {
            res.redirect('/')
        } else{
            res.render('defines/rocks/edit', {
                rock: rock,
                errorMessage: 'Error updating idea'
            })
        }
        
    }
})

router.delete('/:id', async (req, res) => {
    let rock
    try {
        rock = await Rock.findById(req.params.id)
        await rock.deleteOne()
        res.redirect('/rocks')
    } 
    catch {
        if (rock == null) {
            res.redirect('/')
        } else{
            res.redirect(`/rocks/${rock.id}`)
        }
    }
})

module.exports = router