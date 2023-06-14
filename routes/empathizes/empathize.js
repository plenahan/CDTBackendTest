const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    res.render('empathizes/empathize')
})

module.exports = router