const express = require('express')
const router = express.Router()
const PostIt = require('../../models/ideate/post-it')
const Keyword = require('../../models/ideate/keyword')
const { now } = require('mongoose')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

//All Templates Route
router.get('/', async (req, res) => {
    let query = PostIt.find({})
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
        const postIts = await query.exec()
        res.render('ideates/post-its/index', {
            postIts: postIts,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})


//New Template Route
router.get('/new', async (req, res) => {
    renderNewPage(res, { postIt: new PostIt(), keywords: await Keyword.find({}) })
})

//Create Template Route
router.post('/', async (req, res) => {
    const postIt = new PostIt({
        title: req.body.title,
        description: req.body.description,
        keyWords: req.body.keyWords,
        ideaFrom: req.body.ideaFrom,
        priority: req.body.priority,
        needConnected: req.body.needConnected,
        prototypeconnected: req.body.prototypeconnected,
        keyword: req.body.keyword
    })
    saveCover(postIt, req.body.cover)

    try {
        const newPostIt = await postIt.save()
        res.redirect(`post-its/${newPostIt.id}`)
    } catch {
        renderNewPage(res, postIt, true)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const postIt = await PostIt.findById(req.params.id).populate('keyword').exec()
        res.render('ideates/post-its/show', { postIt: postIt })
    } catch {
        res.redirect('/')
    }
})

//Edit Template Route
router.get('/:id/edit', async (req, res) => {
    try {
        const postIt = await PostIt.findById(req.params.id)
        renderEditPage(res, postIt)
    } catch {
        res.redirect('/')
    }
})

//Update Template Route
router.put('/:id', async (req, res) => {
    let postIt

    try {
        postIt = await PostIt.findById(req.params.id)
        postIt.title = req.body.title
        postIt.description = req.body.description
        postIt.keyWords = req.body.keyWords
        postIt.ideaFrom = req.body.ideaFrom
        postIt.prototypeConnected = req.body.prototypeConnected
        postIt.needConnected = req.body.needConnected
        postIt.priority = req.body.priority
        postIt.keyword = req.body.keyword
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(postIt, req.body.cover)
        }
        await postIt.save()
        res.redirect(`/post-its/${postIt.id}`)
    } catch(err) {
        console.log(err)
        if (postIt != null) {
            renderEditPage(res, postIt, true)
        } else {
            redirect('/')
        }
    }
})

router.delete('/:id', async (req, res) => {
    let postIt
    try {
        postIt = await PostIt.findById(req.params.id)
        await postIt.deleteOne()
        res.redirect('/post-its')
    } catch {
        if(postIt != null) {
            res.render('post-its/show', {
                postIt: postIt,
                errorMessage: 'Could not remove post-it'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, postIt, hasError = false) {
    renderFormPage(res, postIt, 'new', hasError)
}

async function renderEditPage(res, postIt, hasError = false) {
    renderFormPage(res, postIt, 'edit', hasError)
}

async function renderFormPage(res, postIt, form, hasError = false) {
    try {
        const keywords = await Keyword.find({})
        const params = {
            keywords: keywords,
            postIt: postIt
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Template'
            }
            else {
                params.errorMessage = 'Error Creating Template'
            }
        }
        res.render(`ideates/post-its/${form}`, params)
    } catch {
        res.redirect('/post-its')
    }
}

function saveCover(postIt, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        postIt.coverImage = new Buffer.from(cover.data, 'base64')
        postIt.coverImageType = cover.type
    }
}

module.exports = router