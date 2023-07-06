const express = require('express')
const router = express.Router()
const IdeationType = require('../../models/ideate/ideationtype')
const IdeationSession = require('../../models/ideate/ideationsession')
const SortBy = require('../../models/sortby')


//All Ideas Route
router.get('/', async (req, res) => {
    const sortby = new SortBy({ title: req.query.SortBy })
    let query = IdeationType.find({})
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
        const ideationTypes = await query.exec()
        res.render('ideates/ideationtypes/index', {
            ideationTypes: ideationTypes,
            SortBy: sortby,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

//New Ideas Route
router.get('/new', (req, res) => {
    res.render('ideates/ideationtypes/new', { ideationType: new IdeationType() })
})

//Create Idea Route
router.post('/', async (req, res) => {
    const ideationType = new IdeationType({
        title: req.body.title
    })
    try {
        const newIdeationType = await ideationType.save()
        res.redirect(`/ideationtypes/${newIdeationType.id}`)
    } 
    catch (err) {
        console.log(err)
        res.render('ideates/ideationtypes/new', {
            ideationType: ideationType,
            errorMessage: 'Error creating idea'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const ideationType = await IdeationType.findById(req.params.id)
        const ideationSessions = await IdeationSession.find({ ideationType: ideationType.id}).limit(6).exec()
        res.render('ideates/ideationtypes/show', {
            ideationType: ideationType,
            ideationSessionsByIdeationType: ideationSessions
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const ideationType = await IdeationType.findById(req.params.id)
        res.render('ideates/ideationtypes/edit', { ideationType: ideationType })
    } catch {
        res.redirect('/ideationtypes')
    }
})

router.put('/:id', async (req, res) => {
    let ideationType
    try {
        ideationType = await IdeationType.findById(req.params.id)
        ideationType.title = req.body.title
        await ideationType.save()
        res.redirect(`/ideationtypes/${ideationType.id}`)
    } catch {
        if (ideationType == null) {
            res.redirect('/')
        } else{
            res.render('ideates/ideationtypes/edit', {
                ideationType: ideationType,
                errorMessage: 'Error updating idea'
            })
        }
        
    }
})

router.delete('/:id', async (req, res) => {
    let ideationType
    try {
        ideationType = await IdeationType.findById(req.params.id)
        const response = await IdeationType.deleteOne({ _id: req.params.id })
        res.redirect('/ideationtypes')
    } 
    catch {
        if (ideationType == null) {
            res.redirect('/')
        } else{
            res.redirect(`/ideationtypes/${ideationType.id}`)
        }
    }
})

module.exports = router