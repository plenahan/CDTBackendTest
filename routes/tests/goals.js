const express = require('express')
const router = express.Router()
const Goal = require('../../models/test/goal')
const Prototype = require('../../models/prototype/prototype')
const SortBy = require('../../models/sortby')


//All Ideas Route
router.get('/', async (req, res) => {
    const sortby = new SortBy({ title: req.query.SortBy })
    let query = Goal.find({})
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
        const goals = await query.exec()
        res.render('tests/goals/index', {
            goals: goals,
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
    res.render('tests/goals/new', { goal: new Goal() })
})

//Create Idea Route
router.post('/', async (req, res) => {
    const goal = new Goal({
        title: req.body.title,
        description: req.body.description
    })
    try {
        const newGoal = await goal.save()
        res.redirect(`/goals/${newGoal.id}`)
    } catch {
        res.render('tests/goals/new', {
            goal: goal,
            errorMessage: 'Error creating idea'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id).exec()
        // const templates = await templates.find({ idea: idea.id})
        res.render('tests/goals/show', {
            goal: goal
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id)
        res.render('tests/goals/edit', { goal: goal })
    } catch {
        res.redirect('/goals')
    }
})

router.put('/:id', async (req, res) => {
    let goal
    try {
        goal = await Goal.findById(req.params.id)
        goal.title = req.body.title
        goal.description = req.body.description
        await goal.save()
        res.redirect(`/goals/${goal.id}`)
    } catch (err) {
        console.log(err)
        if (goal != null) {
            res.redirect('/')
        } else{
            res.render('tests/goals/edit', {
                goal: goal,
                errorMessage: 'Error updating idea'
            })
        }
        
    }
})

router.delete('/:id', async (req, res) => {
    let goal
    try {
        goal = await Goal.findById(req.params.id)
        await goal.deleteOne()
        res.redirect('/goals')
    } 
    catch {
        if (goal == null) {
            res.redirect('/')
        } else{
            res.redirect(`/goals/${goal.id}`)
        }
    }
})

module.exports = router