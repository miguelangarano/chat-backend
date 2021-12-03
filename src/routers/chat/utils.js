const Chat = require("../../models/chat")
const { v4 } = require('uuid')
const moment = require("moment")
const { queryUser, verifyHashedPassword, queryCompleteUser } = require("../user/utils")

async function createGroup(name, adminNickname, adminUser, initialMessage) {
    const chat = await Chat.create({
        name,
        adminNickname,
        users: [
            adminUser
        ],
        messages: [
            {
                id: v4(),
                sender: adminUser,
                date: moment().unix(),
                body: initialMessage
            }
        ]
    }).catch((error) => {
        console.log(error)
        throw new Error("Error al crear chat")
    })
    return {
        name: chat.name,
        adminNickname: chat.adminNickname,
        users: chat.users,
        messages: chat.messages
    }
}

async function addGroupMember(groupName, newMember) {
    const chatGroup = await Chat.findOne({ name: groupName }).catch((error) => {
        console.log(error)
        throw new Error("Error al buscar chat group")
    })
    const queriedUser = await queryUser(newMember.nickname)
    if (queriedUser == null) {
        throw new Error("Error el usuario no está registrado")
    }
    if (chatGroup == null) {
        throw new Error("Error no se encontro el chat group")
    }
    if (newMember == null) {
        throw new Error("Error el nuevo miembro está vacío")
    }
    const exists = chatGroup.users.find(
        item => item.email === newMember.email || item.nickname === newMember.nickname
    )
    if (exists != null) {
        throw new Error("Error el usuario ya existe en este chat")
    }
    chatGroup.users = [...chatGroup.users, newMember]
    await chatGroup.save()
    return { users: chatGroup.users }
}

async function deleteGroup(groupName, adminNickname, adminPassword) {
    const chatGroup = await Chat.findOne({ name: groupName }).catch((error) => {
        console.log(error)
        throw new Error("Error al buscar chat group")
    })
    if (chatGroup == null) {
        throw new Error("Error no se encontro el chat group")
    }
    if (chatGroup.adminNickname !== adminNickname) {
        throw new Error("Error este usuario no es el administrador del grupo")
    }
    const queriedUser = await queryCompleteUser(adminNickname)
    if (queriedUser == null) {
        throw new Error("Error el usuario no está registrado")
    }
    const passwordMatch = await verifyHashedPassword(
        adminPassword,
        queriedUser.password
    )
    if (passwordMatch == false) {
        throw new Error("Error la contraseña es incorrecta")
    }
    chatGroup.remove().catch((error) => {
        throw new Error(`Error no se pudo eliminar`)
    })
    return
}


async function queryChatGroup(chatName) {
    const chatGroup = await Chat.findOne({ name: chatName }).catch((error) => {
        console.log(error)
        throw new Error("Error al buscar chat group")
    })
    if (chatGroup == null) {
        throw new Error("Error no se encontro el chat group")
    }
    return {
        name: chatGroup.name,
        adminNickname: chatGroup.adminNickname,
        users: chatGroup.users,
        message: chatGroup.messages
    }
}

async function queryChatGroups() {
    const chatGroups = await Chat.find({}).select("name").catch((error) => {
        console.log(error)
        throw new Error("Error al buscar chats")
    })
    console.log("@@@@@", chatGroups)
    if (chatGroups == null || chatGroups.length <= 0) {
        throw new Error("Error no se encontro ningún chat")
    }
    return chatGroups
}


module.exports = {
    createGroup,
    addGroupMember,
    deleteGroup,
    queryChatGroup,
    queryChatGroups
}