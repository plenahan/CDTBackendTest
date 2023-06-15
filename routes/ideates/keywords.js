const express = require('express')
const router = express.Router()
const Keyword = require('../../models/ideate/keyword')
const PostIt = require('../../models/ideate/post-it')
const SortBy = require('../../models/sortby')


//All Ideas Route
router.get('/', async (req, res) => {
    const sortby = new SortBy({ title: req.query.SortBy })
    let query = Keyword.find({})
    if (req.query.word != null && req.query.word != '') {
        query = query.regex('word', new RegExp(req.query.word, 'i'))
    }
    if(sortby.title == 'A2Z'){
        query = query.sort( {word: 'asc'} )
    }
    else if (sortby.title == 'Z2A'){
        query = query.sort( {word: 'desc'} )
    }
    // if (req.query.keyword != null && req.query.keyword != '') {
    //     query = query.regex('keyword', new RegExp(req.query.keyword, 'i'))
    // }
    try {
        const keywords = await query.exec()
        res.render('ideates/keywords/index', {
            keywords: keywords,
            SortBy: sortby,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

//New Ideas Route
router.get('/new', (req, res) => {
    res.render('ideates/keywords/new', { keyword: new Keyword() })
})

//Create Idea Route
router.post('/', async (req, res) => {
    const keyword = new Keyword({
        word: req.body.word
    })
    try {
        const newKeyword = await keyword.save()
        res.redirect(`/keywords/${newKeyword.id}`)
    } catch {
        res.render('ideates/keywords/new', {
            keyword: keyword,
            errorMessage: 'Error creating idea'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const keyword = await Keyword.findById(req.params.id)
        const postIts = await PostIt.find({ keyword: keyword.id}).limit(6).exec()
        res.render('ideates/keywords/show', {
            keyword: keyword,
            postItsByKeyword: postIts
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const keyword = await Keyword.findById(req.params.id)
        res.render('ideates/keywords/edit', { keyword: keyword })
    } catch {
        res.redirect('/keywords')
    }
})

router.put('/:id', async (req, res) => {
    let keyword
    try {
        keyword = await Keyword.findById(req.params.id)
        keyword.word = req.body.word
        await keyword.save()
        res.redirect(`/keywords/${keyword.id}`)
    } catch {
        if (keyword == null) {
            res.redirect('/')
        } else{
            res.render('ideates/keywords/edit', {
                keyword: keyword,
                errorMessage: 'Error updating idea'
            })
        }
        
    }
})

router.delete('/:id', async (req, res) => {
    let keyword
    try {
        keyword = await Keyword.findById(req.params.id)
        const response = await Keyword.deleteOne({ _id: req.params.id })
        res.redirect('/keywords')
    } 
    catch {
        if (keyword == null) {
            res.redirect('/')
        } else{
            res.redirect(`/keywords/${keyword.id}`)
        }
    }
})

module.exports = router