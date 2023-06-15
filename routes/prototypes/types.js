const express = require('express')
const router = express.Router()
const Type = require('../../models/prototype/type')
const Prototype = require('../../models/prototype/prototype')
const SortBy = require('../../models/sortby')


//All Ideas Route
router.get('/', async (req, res) => {
    const sortby = new SortBy({ title: req.query.SortBy })
    let query = Type.find({})
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(sortby.title == 'A2Z'){
        query = query.sort( {title: 'asc'} )
    }
    else if (sortby.title == 'Z2A'){
        query = query.sort( {title: 'desc'} )
    }
    // if (req.query.keyword != null && req.query.keyword != '') {
    //     query = query.regex('keyword', new RegExp(req.query.keyword, 'i'))
    // }
    try {
        const types = await query.exec()
        res.render('prototypes/types/index', {
            types: types,
            SortBy: sortby,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

//New Ideas Route
router.get('/new', (req, res) => {
    res.render('prototypes/types/new', { type: new Type() })
})

//Create Idea Route
router.post('/', async (req, res) => {
    const type = new Type({
        title: req.body.title
    })
    try {
        const newType = await type.save()
        res.redirect(`/types/${newType.id}`)
    } 
    catch {
        res.render('prototypes/types/new', {
            type: type,
            errorMessage: 'Error creating idea'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const type = await Type.findById(req.params.id)
        const prototypes = await Prototype.find({ type: type.id}).limit(6).exec()
        res.render('prototypes/types/show', {
            type: type,
            prototypesByType: prototypes
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const type = await Type.findById(req.params.id)
        res.render('prototypes/types/edit', { type: type })
    } catch {
        res.redirect('/types')
    }
})

router.put('/:id', async (req, res) => {
    let type
    try {
        type = await Type.findById(req.params.id)
        type.title = req.body.title
        await type.save()
        res.redirect(`/types/${type.id}`)
    } catch {
        if (type == null) {
            res.redirect('/')
        } else{
            res.render('prototypes/types/edit', {
                type: type,
                errorMessage: 'Error updating idea'
            })
        }
        
    }
})

router.delete('/:id', async (req, res) => {
    let type
    try {
        type = await Type.findById(req.params.id)
        const response = await Type.deleteOne({ _id: req.params.id })
        res.redirect('/types')
    } 
    catch {
        if (type == null) {
            res.redirect('/')
        } else{
            res.redirect(`/types/${type.id}`)
        }
    }
})

module.exports = router