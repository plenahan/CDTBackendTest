const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    res.render('prototypes/prototype')
})

module.exports = router