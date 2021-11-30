const express = require("express")
const app = express()
const cors = require("cors")

const port = process.env.PORT | 4123
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use(cors())


app.listen(port, () => {
    console.log("Server running on " + port)
})