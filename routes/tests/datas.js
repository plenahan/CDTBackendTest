const express = require('express')
const router = express.Router()
const Data = require('../../models/test/data')
const SortBy = require('../../models/sortby')

//All Ideas Route
router.get('/', async (req, res) => {
    const sortby = new SortBy({ title: req.query.SortBy })
    let query = Data.find({})
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
        const datas = await query.exec()
        res.render('tests/datas/index', {
            datas: datas,
            SortBy: sortby,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
    // res.render('ideates/notes/index')
})

//New Ideas Route
router.get('/new',  async (req, res) => {
    res.render('tests/datas/new', { data: new Data() })
})

//Create Idea Route
router.post('/',  async (req, res) => {
    const uploadedFile = req.file
    const data = new Data({
        title: req.body.title,
        description: req.body.description,
        file: req.body.file,
        metric: req.body.metric
    })
    try {
        const newData = await data.save()
        res.redirect(`/datas/${newData.id}`)
    } catch (err) {
        console.log(err)
        res.render('tests/datas/new', {
            data: data,
            errorMessage: 'Error creating idea'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const data = await Data.findById(req.params.id).exec()
        // const templates = await templates.find({ idea: idea.id})
        res.render('tests/datas/show', {
            data: data
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const data = await Data.findById(req.params.id)
        res.render('tests/datas/edit', { data: data })
    } catch {
        res.redirect('/datas')
    }
})

router.put('/:id', async (req, res) => {
    let data
    try {
        data = await Data.findById(req.params.id)
        data.title = req.body.title
        data.description = req.body.description
        if (req.body.file != null && req.body.file !== '') {
            data.file = req.body.file
        }
        data.metric = req.body.metric
        await data.save()
        res.redirect(`/datas/${data.id}`)
    } catch {
        if (data != null) {
            res.redirect('/')
        } else{
            res.render('tests/datas/edit', {
                data: data,
                errorMessage: 'Error updating idea'
            })
        }
        
    }
})

router.delete('/:id', async (req, res) => {
    let data
    try {
        data = await Data.findById(req.params.id)
        await data.deleteOne()
        res.redirect('/datas')
    } 
    catch {
        if (data == null) {
            res.redirect('/')
        } else{
            res.redirect(`/datas/${data.id}`)
        }
    }
})

module.exports = router