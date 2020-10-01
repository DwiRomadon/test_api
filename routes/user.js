const router = require('express').Router()
const user = require('../controller/user')

router.post("/registrasi", (req, res) => {
    user.registrasiUser(req.body)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

router.post("/login", (req, res) => {
    user.login(req.body)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})


router.put("/ubahpetuser/:id/", (req, res) => {
    user.updateUser(req.body, req.params.id)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

module.exports = router
