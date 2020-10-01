const router = require('express').Router()
const dokter = require('../controller/dokter')

router.post("/input", (req, res) => {
    dokter.inputData(req.body)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

router.get("/getdata/:id", (req, res) => {
    dokter.getdokter(req.params.id)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

module.exports = router