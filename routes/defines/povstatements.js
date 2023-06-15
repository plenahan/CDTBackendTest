const express = require('express')
const router = express.Router()
const POVStatement = require('../../models/define/povstatement')
const PostIt = require('../../models/ideate/post-it')
const SortBy = require('../../models/sortby')


//All Ideas Route
router.get('/', async (req, res) => {
    const sortby = new SortBy({ title: req.query.SortBy })
    let query = POVStatement.find({})
    if (req.query.statement != null && req.query.statement != '') {
        query = query.regex('statement', new RegExp(req.query.statement, 'i'))
    }
    if (req.query.createdBefore != null && req.query.createdBefore != '') {
        query = query.lte('createdAt', req.query.createdBefore)
    }
    if (req.query.createdAfter != null && req.query.createdAfter != '') {
        query = query.gte('createdAt', req.query.createdAfter)
    }
    if(sortby.title == 'A2Z'){
        query = query.sort( {statement: 'asc'} )
    }
    else if (sortby.title == 'Z2A'){
        query = query.sort( {statement: 'desc'} )
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
        const povstatements = await query.exec()
        res.render('defines/povstatements/index', {
            povstatement: povstatements,
            SortBy: sortby,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

//New Ideas Route
router.get('/new', (req, res) => {
    res.render('defines/povstatements/new', { povstatement: new POVStatement() })
})

//Create Idea Route
router.post('/', async (req, res) => {
    const povstatement = new POVStatement({
        statement: req.body.statement,
        description: req.body.description
    })
    try {
        const newNote = await povstatement.save()
        res.redirect(`/povstatements/${newNote.id}`)
    } catch {
        res.render('defines/povstatements/new', {
            povstatement: povstatement,
            errorMessage: 'Error creating idea'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const povstatement = await POVStatement.findById(req.params.id)
        const postIts = await PostIt.find({ needConnected: povstatement.id}).limit(6).exec()
        res.render('defines/povstatements/show', {
            povstatement: povstatement,
            postItsByNeed: postIts
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const povstatement = await POVStatement.findById(req.params.id)

        res.render('defines/povstatements/edit', { povstatement: povstatement })
    } catch {
        res.redirect('/povstatements')
    }
})

router.put('/:id', async (req, res) => {
    let povstatement
    try {
        povstatement = await POVStatement.findById(req.params.id)
        povstatement.statement = req.body.statement
        povstatement.description = req.body.description
        await povstatement.save()
        res.redirect(`/povstatements/${povstatement.id}`)
    } catch {
        if (povstatement == null) {
            res.redirect('/')
        } else{
            res.render('defines/povstatements/edit', {
                povstatement: povstatement,
                errorMessage: 'Error updating idea'
            })
        }
        
    }
})

router.delete('/:id', async (req, res) => {
    let povstatement
    try {
        povstatement = await POVStatement.findById(req.params.id)
        const response = await Type.deleteOne({ _id: req.params.id })
        res.redirect('/povstatements')
    } 
    catch {
        if (type == null) {
            res.redirect('/')
        } else{
            res.redirect(`/povstatements/${povstatement.id}`)
        }
    }
})

module.exports = router