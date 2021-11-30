const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    adminNickName: {
        type: String,
        required: true
    },
    users: [
        {
            user: {
                email: {
                    type: String,
                    required: true,
                    unique: true,
                    match: RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
                },
                nickname: {
                    type: String,
                    required: true,
                    unique: true,
                    maxlength: 15
                },
                imageUrl: {
                    type: String,
                    match: RegExp(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i)
                }
            }
        }
    ],
    messages: [
        {
            message: {
                id: {
                    type: String,
                    required: true
                },
                sender: {
                    email: {
                        type: String,
                        required: true,
                        unique: true,
                        match: RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
                    },
                    nickname: {
                        type: String,
                        required: true,
                        unique: true,
                        maxlength: 15
                    },
                    imageUrl: {
                        type: String,
                        match: RegExp(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i)
                    }
                },
                date: {
                    type: Number,
                    required: true
                },
                body: {
                    type: String,
                    required: true
                }
            }
        }
    ]
})

const Chat = mongoose.model("Chat", chatSchema)
module.exports = Chat