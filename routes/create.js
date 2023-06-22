const express = require('express')
const router = express.Router()
// const Learn = require('../models/learn')

router.get('/', async (req, res) => {
    res.render('create/index')  
})

module.exports = router