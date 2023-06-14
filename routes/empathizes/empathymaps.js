const express = require('express')
const router = express.Router()
const EmpathyMap = require('../../models/empathize/empathymap')
// const Keyword = require('../../models/ideate/keyword')
const { now } = require('mongoose')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

//All Templates Route
router.get('/', async (req, res) => {
    let query = EmpathyMap.find({})
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
        const empathyMaps = await query.exec()
        res.render('empathizes/empathymaps/index', {
            empathyMaps: empathyMaps,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})


//New Template Route
router.get('/new', async (req, res) => {
    renderNewPage(res, { empathyMap: new EmpathyMap() })
})

//Create Template Route
router.post('/', async (req, res) => {
    const empathyMap = new EmpathyMap({
        title: req.body.title,
        description: req.body.description
    })
    saveCover(empathyMap, req.body.cover)

    try {
        const newEmpathyMap = await empathyMap.save()
        res.redirect(`empathymaps/${newEmpathyMap.id}`)
    } catch {
        renderNewPage(res, empathyMap, true)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const empathyMap = await EmpathyMap.findById(req.params.id)
        res.render('empathizes/empathymaps/show', { empathyMap: empathyMap })
    } catch {
        res.redirect('/')
    }
})

//Edit Template Route
router.get('/:id/edit', async (req, res) => {
    try {
        const empathyMap = await EmpathyMap.findById(req.params.id)
        renderEditPage(res, empathyMap)
    } catch {
        res.redirect('/')
    }
})

//Update Template Route
router.put('/:id', async (req, res) => {
    let empathyMap

    try {
        empathyMap = await EmpathyMap.findById(req.params.id)
        empathyMap.title = req.body.title
        empathyMap.description = req.body.description
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(empathyMap, req.body.cover)
        }
        await empathyMap.save()
        res.redirect(`/empathymaps/${empathyMap.id}`)
    } catch(err) {
        console.log(err)
        if (empathyMap != null) {
            renderEditPage(res, empathyMap, true)
        } else {
            redirect('/')
        }
    }
})

router.delete('/:id', async (req, res) => {
    let empathyMap
    try {
        empathyMap = await EmpathyMap.findById(req.params.id)
        await empathyMap.deleteOne()
        res.redirect('/empathymaps')
    } catch {
        if(empathyMap != null) {
            res.render('empathymaps/show', {
                empathyMap: empathyMap,
                errorMessage: 'Could not remove empathy map'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, empathyMap, hasError = false) {
    renderFormPage(res, empathyMap, 'new', hasError)
}

async function renderEditPage(res, empathyMap, hasError = false) {
    renderFormPage(res, empathyMap, 'edit', hasError)
}

async function renderFormPage(res, empathyMap, form, hasError = false) {
    try {
        const params = {
            empathyMap: empathyMap
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Empathy Map'
            }
            else {
                params.errorMessage = 'Error Creating Empathy Map'
            }
        }
        res.render(`empathizes/empathymaps/${form}`, params)
    } catch {
        res.redirect('/empathymaps')
    }
}

function saveCover(empathyMap, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        empathyMap.coverImage = new Buffer.from(cover.data, 'base64')
        empathyMap.coverImageType = cover.type
    }
}

module.exports = router