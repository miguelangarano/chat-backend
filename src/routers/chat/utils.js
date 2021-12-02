const Chat = require("../../models/chat")
const { v4 } = require('uuid')
const moment = require("moment")

async function createGroup(name, adminNickname, adminUser, initialMessage) {
    const newChat = {
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
    }
    console.log("@@@@@@@", newChat)
    const chat = await Chat.create(newChat).catch((error) => {
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


module.exports = { createGroup }