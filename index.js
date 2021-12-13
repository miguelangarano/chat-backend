const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const userRouter = require("./src/routers/user")
const chatRouter = require("./src/routers/chat")
const mongoose = require("mongoose")
mongoose.connect(process.env.MONGOURL)

const port = process.env.PORT | 4123
app.use(express.json())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use(cors())

app.use(userRouter)
app.use(chatRouter)

const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});

io.on("connection", socket => {
    /** handshake: Es el id de conexion con el dispositivo cliente */
    const id_handshake = socket.id;

    console.log(id_handshake)

    /** query: En este ejemplo practico queremos enviar una información extra en la conexión
     * acerca del usuario que esta logeado en el Front. Para ello lo enviamos dentro de un objeto por defecto llamado "query"
     */
    let { payload } = socket.handshake.query;


    console.log(`Nuevo dispositivo conectado: ${id_handshake}`);

    if (!payload) {

        console.log(`Sin payload`);

    } else {
        payload = JSON.parse(payload)

        /**
         * Una vez enviado la informacion del usuario conectado en este caso es un peequeño objecto que contiene nombre y id,
         * creamos una sala y lo unimos https://socket.io/docs/rooms-and-namespaces/
         */
        socket.join(`room_${payload.id}`);

        console.log(`El dispositivo ${id_handshake} se unio a -> ${`room_${payload.id}`}`);

        /**
         * --------- EMITIR -------------
         * Para probar la conexion con el dispositivo unico le emitimos un mensaje a el dispositivo conectado
         */
        socket.emit('message', {
            msg: `Hola tu eres el dispositivo ${id_handshake}, perteneces a la sala room_${payload.id}, de ${payload.user}`
        });

        /**
         * ----------- ESCUCHAR -------------
         * Cuando el cliente nos emite un mensaje la api los escucha de la siguiente manera
         */
        socket.on('default', function (res) {

            switch (res.event) {
                case 'message':
                    /**
                     * Si el evento que escucha es "message", se parsea la informacion recibida
                     * y posteriormente se emite un "message" a todos los dispositivos unidos a la sala.
                     */
                    const inPayloadCookie = JSON.parse(res.cookiePayload);
                    const inPayload = res.payload;

                    io.to(`room_${inPayloadCookie.id}`).emit('message', {
                        msg: `Mensaje a todos los dispositivos de la sala room__${inPayloadCookie.id}: ${inPayload.message}`
                    });

                    break;
                default:
                    /** Otros posibles casos */
                    break;
            }

        });
    };

    /**
     * Si un dispositivo se desconecto lo detectamos aqui
     */
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(4124, function () {
    console.log('\n')
    console.log(`>> Socket listo y escuchando por el puerto: 4124`)
})




app.listen(port, () => {
    console.log("Server running on " + port)
})