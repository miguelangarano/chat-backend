const express = require("express")
const router = new express.Router()
const { registerUser, loginUser } = require("./utils")

router.post("/user/register", async (req, res) => {
    try {
        const request = req.body
        console.log("/user/register", request)
        const newUser = await registerUser(
            request.email,
            request.nickname,
            request.password
        )
        res.status(200).send({
            status: true,
            message: "Usuario registrado con éxito",
            data: {
                email: newUser.email,
                nickname: newUser.nickname,
                token: newUser.token
            }
        })
    } catch (error) {
        console.log("ERROR", error)
        res.status(500).send({
            status: false,
            message: "Registro falló",
            data: { error: error.toString() }
        })
    }
})

router.post("/user/login", async (req, res) => {
    try {
        const request = req.body
        console.log("/user/login", request)
        const loggedUser = await loginUser(
            request.email,
            request.password
        )
        res.status(200).send({
            status: true,
            message: "Usuario ingresó con éxito",
            data: {
                email: loggedUser.email,
                nickname: loggedUser.nickname,
                token: loggedUser.token
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: false,
            message: "Login falló",
            data: { error: error.toString() }
        })
    }
})

module.exports = router