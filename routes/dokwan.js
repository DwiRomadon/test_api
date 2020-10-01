const router = require('express').Router()
const dokwan = require('../controller/dokwan')
const multer = require('multer')

var storage = multer.diskStorage({
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(
            file.originalname.lastIndexOf("."),
            file.originalname.length
        )
        cb(null, Date.now() + ext);
    },
    destination: function (req, file, cb) {
        // console.log(file)
        cb(null, './gambar')
    }
})


var upload = multer({storage: storage}).single("gambar")

router.post("/input", upload, (req, res) => {
    dokwan.inputData(req.body, req.file.filename)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

router.post("/getdata/:radius/:id", (req, res) => {
    dokwan.getDokwan(req.body,req.params.radius,req.params.id)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

router.post("/getdata/:radius/", (req, res) => {
    dokwan.getDokwanUser(req.body,req.params.radius)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

router.post("/getdatafav/:radius/", (req, res) => {
    dokwan.getDokwanFav(req.body,req.params.radius)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

router.post("/getdatahistory/:radius/", (req, res) => {
    dokwan.getDokwanHistroy(req.body,req.params.radius)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

router.put("/ubahpetdokwan/:id/",upload, (req, res) => {
    dokwan.updateDataDokswa(req.body, req.params.id)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

router.put("/ubahgambar/:id", upload, (req, res) => {
    dokwan.updateDataGambar(req.file.filename, req.params.id)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

router.put("/ubah/:id",upload, (req, res) => {
    dokwan.updateData(req.body, req.params.id)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

module.exports = router
