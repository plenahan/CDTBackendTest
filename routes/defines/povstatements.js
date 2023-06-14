const express = require('express')
const router = express.Router()
const POVStatement = require('../../models/define/povstatement')



//All Ideas Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.title != null && req.query.title !== '') {
        searchOptions.title = new RegExp(req.query.title, 'i')
    }
    try {
        const povstatement = await POVStatement.find(searchOptions)
        res.render('defines/povstatements/index', { 
            povstatement: povstatement, 
            searchOptions: req.query })
    } catch {
        res.redirect('/')
    }  
    // res.render('ideates/notes/index')
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
        // const templates = await templates.find({ idea: idea.id})
        res.render('defines/povstatements/show', {
            povstatement: povstatement
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
        await povstatement.deleteOne()
        res.redirect('/povstatements')
    } 
    catch {
        if (povstatement == null) {
            res.redirect('/')
        } else{
            res.redirect(`/povstatements/${povstatement.id}`)
        }
    }
})

module.exports = router