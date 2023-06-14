const express = require('express')
const router = express.Router()
const JourneyMap = require('../../models/empathize/journeymap')
// const Keyword = require('../../models/ideate/keyword')
const { now } = require('mongoose')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

//All Templates Route
router.get('/', async (req, res) => {
    let query = JourneyMap.find({})
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
        const journeyMaps = await query.exec()
        res.render('empathizes/journeymaps/index', {
            journeyMaps: journeyMaps,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})


//New Template Route
router.get('/new', async (req, res) => {
    renderNewPage(res, { journeyMap: new JourneyMap() })
})

//Create Template Route
router.post('/', async (req, res) => {
    const journeyMap = new JourneyMap({
        title: req.body.title,
        description: req.body.description
    })
    saveCover(journeyMap, req.body.cover)

    try {
        const newJourneyMap = await journeyMap.save()
        res.redirect(`journeyMaps/${newJourneyMap.id}`)
    } catch {
        renderNewPage(res, journeyMap, true)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const journeyMap = await JourneyMap.findById(req.params.id)
        res.render('empathizes/journeymaps/show', { journeyMap: journeyMap })
    } catch {
        res.redirect('/')
    }
})

//Edit Template Route
router.get('/:id/edit', async (req, res) => {
    try {
        const journeyMap = await JourneyMap.findById(req.params.id)
        renderEditPage(res, journeyMap)
    } catch {
        res.redirect('/')
    }
})

//Update Template Route
router.put('/:id', async (req, res) => {
    let journeyMap

    try {
        journeyMap = await JourneyMap.findById(req.params.id)
        journeyMap.title = req.body.title
        journeyMap.description = req.body.description
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(journeyMap, req.body.cover)
        }
        await journeyMap.save()
        res.redirect(`/journeymaps/${journeyMap.id}`)
    } catch(err) {
        console.log(err)
        if (journeyMap != null) {
            renderEditPage(res, journeyMap, true)
        } else {
            redirect('/')
        }
    }
})

router.delete('/:id', async (req, res) => {
    let journeyMap
    try {
        journeyMap = await JourneyMap.findById(req.params.id)
        await journeyMap.deleteOne()
        res.redirect('/journeymaps')
    } catch {
        if(journeyMap != null) {
            res.render('journeymaps/show', {
                journeyMap: journeyMap,
                errorMessage: 'Could not remove journey map'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, journeyMap, hasError = false) {
    renderFormPage(res, journeyMap, 'new', hasError)
}

async function renderEditPage(res, journeyMap, hasError = false) {
    renderFormPage(res, journeyMap, 'edit', hasError)
}

async function renderFormPage(res, journeyMap, form, hasError = false) {
    try {
        const params = {
            journeyMap: journeyMap
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Template'
            }
            else {
                params.errorMessage = 'Error Creating Template'
            }
        }
        res.render(`empathizes/journeymaps/${form}`, params)
    } catch {
        res.redirect('/journeymaps')
    }
}

function saveCover(journeyMap, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        journeyMap.coverImage = new Buffer.from(cover.data, 'base64')
        journeyMap.coverImageType = cover.type
    }
}

module.exports = router