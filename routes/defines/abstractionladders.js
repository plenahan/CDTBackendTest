const express = require('express')
const router = express.Router()
const AbstractionLadder = require('../../models/define/abstractionladder')
// const Keyword = require('../../models/ideate/keyword')
const { now } = require('mongoose')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

//All Templates Route
router.get('/', async (req, res) => {
    let query = AbstractionLadder.find({})
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.createdBefore != null && req.query.createdBefore != '') {
        query = query.lte('createdAt', req.query.createdBefore)
    }
    if (req.query.createdAfter != null && req.query.createdAfter != '') {
        query = query.gte('createdAt', req.query.createdAfter)
    }
    // if (req.query.keyword != null && req.query.keyword != '') {
    //     query = query.regex('keyword', new RegExp(req.query.keyword, 'i'))
    // }
    try {
        const abstractionLadders = await query.exec()
        res.render('defines/abstractionladders/index', {
            abstractionLadders: abstractionLadders,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})


//New Template Route
router.get('/new', async (req, res) => {
    renderNewPage(res, { abstractionLadder: new AbstractionLadder() })
})

//Create Template Route
router.post('/', async (req, res) => {
    const abstractionLadder = new AbstractionLadder({
        title: req.body.title,
        description: req.body.description
    })
    saveCover(abstractionLadder, req.body.cover)

    try {
        const newAbstractionLadder = await abstractionLadder.save()
        res.redirect(`abstractionladders/${newAbstractionLadder.id}`)
    } catch {
        renderNewPage(res, abstractionLadder, true)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const abstractionLadder = await AbstractionLadder.findById(req.params.id)
        res.render('defines/abstractionladders/show', { abstractionLadder: abstractionLadder })
    } catch {
        res.redirect('/')
    }
})

//Edit Template Route
router.get('/:id/edit', async (req, res) => {
    try {
        const abstractionLadder = await AbstractionLadder.findById(req.params.id)
        renderEditPage(res, abstractionLadder)
    } catch {
        res.redirect('/')
    }
})

//Update Template Route
router.put('/:id', async (req, res) => {
    let abstractionLadder

    try {
        abstractionLadder = await AbstractionLadder.findById(req.params.id)
        abstractionLadder.title = req.body.title
        abstractionLadder.description = req.body.description
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(abstractionLadder, req.body.cover)
        }
        await abstractionLadder.save()
        res.redirect(`/abstractionladders/${abstractionLadder.id}`)
    } catch(err) {
        console.log(err)
        if (abstractionLadder != null) {
            renderEditPage(res, abstractionLadder, true)
        } else {
            redirect('/')
        }
    }
})

router.delete('/:id', async (req, res) => {
    let abstractionLadder
    try {
        abstractionLadder = await AbstractionLadder.findById(req.params.id)
        await abstractionLadder.deleteOne()
        res.redirect('/abstractionladders')
    } catch {
        if(abstractionLadder != null) {
            res.render('abstractionladders/show', {
                abstractionLadder: abstractionLadder,
                errorMessage: 'Could not remove empathy map'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, abstractionLadder, hasError = false) {
    renderFormPage(res, abstractionLadder, 'new', hasError)
}

async function renderEditPage(res, abstractionLadder, hasError = false) {
    renderFormPage(res, abstractionLadder, 'edit', hasError)
}

async function renderFormPage(res, abstractionLadder, form, hasError = false) {
    try {
        const params = {
            abstractionLadder: abstractionLadder
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Abstraction Ladder'
            }
            else {
                params.errorMessage = 'Error Creating Abstraction Ladder'
            }
        }
        res.render(`defines/abstractionladders/${form}`, params)
    } catch {
        res.redirect('/abstractionladders')
    }
}

function saveCover(abstractionLadder, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        abstractionLadder.coverImage = new Buffer.from(cover.data, 'base64')
        abstractionLadder.coverImageType = cover.type
    }
}

module.exports = router