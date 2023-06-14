const express = require('express')
const router = express.Router()
const Persona = require('../../models/empathize/persona')



//All Ideas Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const personas = await Persona.find(searchOptions)
        res.render('empathizes/personas/index', { 
            personas: personas, 
            searchOptions: req.query })
    } catch {
        res.redirect('/')
    }  
    // res.render('ideates/notes/index')
})

//New Ideas Route
router.get('/new', (req, res) => {
    res.render('empathizes/personas/new', { persona: new Persona() })
})

//Create Idea Route
router.post('/', async (req, res) => {
    const persona = new Persona({
        name: req.body.name,
        description: req.body.description,
        who: req.body.who,
        do: req.body.do,
        feel: req.body.feel
    })
    try {
        const newPersona = await persona.save()
        res.redirect(`/personas/${newPersona.id}`)
    } catch {
        res.render('empathizes/personas/new', {
            persona: persona,
            errorMessage: 'Error creating persona'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const persona = await Persona.findById(req.params.id)
        // const templates = await templates.find({ idea: idea.id})
        res.render('empathizes/personas/show', {
            persona: persona
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const persona = await Persona.findById(req.params.id)
        res.render('empathizes/personas/edit', { persona: persona })
    } catch {
        res.redirect('/personas')
    }
})

router.put('/:id', async (req, res) => {
    let persona
    try {
        persona = await Persona.findById(req.params.id)
        persona.name = req.body.name
        persona.description = req.body.description
        persona.who = req.body.who
        persona.do = req.body.do
        persona.feel = req.body.feel
        await persona.save()
        res.redirect(`/personas/${persona.id}`)
    } catch {
        if (persona == null) {
            res.redirect('/')
        } else{
            res.render('empathizes/personas/edit', {
                persona: persona,
                errorMessage: 'Error updating idea'
            })
        }
        
    }
})

router.delete('/:id', async (req, res) => {
    let persona
    try {
        persona = await Persona.findById(req.params.id)
        await persona.deleteOne()
        res.redirect('/personas')
    } 
    catch {
        if (note == null) {
            res.redirect('/')
        } else{
            res.redirect(`/personas/${persona.id}`)
        }
    }
})

module.exports = router