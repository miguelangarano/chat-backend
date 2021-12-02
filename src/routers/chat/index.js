const express = require("express")
const { authenticate } = require("../../middleware/auth")
const router = new express.Router()
const { createGroup } = require("./utils")

//Crear grupo
router.post("/chat/create-group", authenticate, async (req, res) => {
    try {
        const request = req.body
        const createdGroup = await createGroup(
            request.name,
            request.adminNickname,
            request.adminUser,
            request.initialMessage
        )
        res.status(200).send({
            status: true,
            message: "Grupo registrado con éxito",
            data: { chat: createdGroup }
        })
    } catch (error) {
        console.log("ERROR", error)
        res.status(500).send({
            status: false,
            message: "Creación de grupo falló",
            data: { error: error.toString() }
        })
    }
})

//Actualizar grupo

//Agregar participantes a grupo

//Eliminar participantes de grupo

//Eliminar grupo

//Enviar mensaje a grupo

module.exports = router