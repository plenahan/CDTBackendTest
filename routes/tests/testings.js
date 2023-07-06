const express = require('express')
const router = express.Router()
const Testing = require('../../models/test/testing')
const Prototype = require('../../models/prototype/prototype')
const Goal = require('../../models/test/goal')
const Data = require('../../models/test/data')
const SortBy = require('../../models/sortby')


//All Ideas Route
router.get('/', async (req, res) => {
    const sortby = new SortBy({ title: req.query.SortBy })
    let query = Testing.find({})
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
        const testing = await query.exec()
        res.render('tests/testing/index', {
            testings: testing,
            SortBy: sortby,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
    // res.render('ideates/notes/index')
})

//New Ideas Route
router.get('/new', async (req, res) => {
    res.render('tests/testing/new', { testing: new Testing(), prototypes: await Prototype.find({}), goals: await Goal.find({}), datas: await Data.find({}) })
})

//Create Idea Route
router.post('/', async (req, res) => {
    const testing = new Testing({
        title: req.body.title,
        description: req.body.description,
        prototypes: req.body.prototypes,
        goals: req.body.goals,
        conditions: req.body.conditions,
        data: req.body.data,
        addressedUserNeeds: req.body.addressedUserNeeds
    })
    try {
        const newTesting = await testing.save()
        res.redirect(`/testing/${newTesting.id}`)
    } catch {
        res.render('tests/testing/new', {
            testing: testing,
            errorMessage: 'Error creating idea'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const testing = await Testing.findById(req.params.id).populate('prototypes').populate('goals').populate('data').exec()
        // const templates = await templates.find({ idea: idea.id})
        res.render('tests/testing/show', {
            testing: testing,
            prototypes: testing.prototypes,
            goals: testing.goals
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const testing = await Testing.findById(req.params.id)
        res.render('tests/testing/edit', { testing: testing, prototypes: await Prototype.find({}), goals: await Goal.find({}), datas: await Data.find({}) })
    } catch {
        res.redirect('/testing')
    }
})

router.put('/:id', async (req, res) => {
    let testing
    try {
        testing = await Testing.findById(req.params.id)
        testing.title = req.body.title
        testing.description = req.body.description
        testing.prototypes = req.body.prototypes
        testing.goals = req.body.goals
        testing.conditions = req.body.conditions
        testing.data = req.body.data
        testing.addressedUserNeeds = req.body.addressedUserNeeds
        await testing.save()
        res.redirect(`/testing/${testing.id}`)
    } catch {
        if (testing == null) {
            res.redirect('/')
        } else{
            res.render('tests/testing/edit', {
                testing: testing,
                errorMessage: 'Error updating idea'
            })
        }
        
    }
})

router.delete('/:id', async (req, res) => {
    let testing
    try {
        testing = await Testing.findById(req.params.id)
        await testing.deleteOne()
        res.redirect('/testing')
    } 
    catch {
        if (testing == null) {
            res.redirect('/')
        } else{
            res.redirect(`/testing/${testing.id}`)
        }
    }
})

module.exports = router