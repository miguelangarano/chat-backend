const User = require("../../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

async function registerUser(email, nickname, password) {
    const hashedPassword = await hashPassword(password).catch((error) => {
        console.log(error)
        throw new Error(`Error hasheando la contraseña. ${error}`)
    })
    const token = createToken(email, nickname)
    const user = await User.create({
        email,
        nickname,
        password: hashedPassword,
        token
    }).catch((error) => {
        console.log(error)
        throw new Error(`Error registrando al usuario. ${error}`)
    })
    return { email, nickname, token }
}

async function hashPassword(password) {
    return await bcrypt.hash(password, 5)
}

async function verifyHashedPassword(password, storedPassword) {
    return await bcrypt.compare(password, storedPassword)
}

function createToken(email, nickname) {
    const token = jwt.sign(
        { email, nickname },
        process.env.SIGN_PASSWORD
    )
    return token
}

async function loginUser(email, password) {
    const user = await User.findOne({ email }).catch((error) => {
        console.log(error)
        throw new Error(`Error encontrando usuario ${error}`)
    })
    if (user == null) {
        throw new Error(`Error usuario no encontrado`)
    }
    const passwordMatch = await verifyHashedPassword(
        password,
        user.password
    )
    if (passwordMatch === false) {
        throw new Error(`Error. Contraseña incorrecta.`)
    }
    const token = createToken(email, user.nickname)
    user.token = token
    await user.save().catch((error) => {
        console.log(error)
        throw new Error(`Error guardando nuevo token ${error}`)
    })
    return { email, nickname: user.nickname, token }
}

module.exports = { registerUser, loginUser }