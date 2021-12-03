const express = require("express")
const { authenticate } = require("../../middleware/auth")
const router = new express.Router()
const {
    createGroup,
    addGroupMember,
    deleteGroup,
    queryChatGroup,
    queryChatGroups
} = require("./utils")

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

//Agregar participantes a grupo
router.patch("/chat/add-group-member", authenticate, async (req, res) => {
    try {
        const request = req.body
        const updatedGroup = await addGroupMember(
            request.groupName,
            request.newMember
        )
        res.status(200).send({
            status: true,
            message: "Miembro agregado con éxito",
            data: { users: updatedGroup.users }
        })
    } catch (error) {
        console.log("ERROR", error)
        res.status(500).send({
            status: false,
            message: "Falló al agregar",
            data: { error: error.toString() }
        })
    }
})

//Eliminar grupo
router.delete("/chat/delete-group", authenticate, async (req, res) => {
    try {
        const request = req.body
        await deleteGroup(
            request.groupName,
            request.adminNickname,
            request.adminPassword
        )
        res.status(200).send({
            status: true,
            message: "Grupo eliminado con éxito",
            data: {}
        })
    } catch (error) {
        console.log("ERROR", error)
        res.status(500).send({
            status: false,
            message: "Falló al eliminar",
            data: { error: error.toString() }
        })
    }
})

//Consultar todos los chats
router.get("/chat/all", authenticate, async (req, res) => {
    try {
        const request = req.body
        const params = req.params
        console.log("/chat/all", request, params)
        const queriedChats = await queryChatGroups()
        res.status(200).send({
            status: true,
            message: "Chat consultado con éxito",
            data: { chats: queriedChats }
        })
    } catch (error) {
        console.log("ERROR", error)
        res.status(500).send({
            status: false,
            message: "Consulta falló",
            data: { error: error.toString() }
        })
    }
})

//Consultar chat completo
router.get("/chat/:chatName", authenticate, async (req, res) => {
    try {
        const request = req.body
        const params = req.params
        console.log("/chat/:chatName", request, params)
        const queriedChat = await queryChatGroup(
            params.chatName
        )
        res.status(200).send({
            status: true,
            message: "Chat consultado con éxito",
            data: { chat: queriedChat }
        })
    } catch (error) {
        console.log("ERROR", error)
        res.status(500).send({
            status: false,
            message: "Consulta falló",
            data: { error: error.toString() }
        })
    }
})



//Enviar mensaje a grupo



module.exports = router