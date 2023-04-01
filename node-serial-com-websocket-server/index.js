///dev/cu.usbmodem142301

import { express, Server, cors, SerialPort, ReadlineParser } from './dependencies.js'

const PORT = 5050;

//⚙️ HTTP COMMUNICATION SETUP _________________________________________________
const app = express();
const STATIC_MUPI_DISPLAY = express.static('public-display');
app.use('/mupi-display', STATIC_MUPI_DISPLAY);
app.use(express.json());
//============================================ END

//⚙️ SERIAL COMMUNICATION SETUP -------------------------------------------------
const protocolConfiguration = { // *New: Defining Serial configurations
    path: '/dev/cu.usbmodem142301', //*Change this COM# or usbmodem#####
    baudRate: 9600
};
const port = new SerialPort(protocolConfiguration);
const parser = port.pipe(new ReadlineParser);
//============================================ END

//⚙️ WEBSOCKET COMMUNICATION SETUP -------------------------------------------------
const httpServer = app.listen(PORT, () => {
    console.table(
        {
            'Mupi display:' : 'http://localhost:5050/mupi-display',
        }
    )
});
const ioServer = new Server(httpServer, { path: '/real-time' });
//============================================ END

/* 🔄 SERIAL COMMUNICATION WORKING___________________________________________
Listen to the 'data' event, arduinoData has the message inside*/

parser.on('data', (arduinoData) => {

    let dataArray = arduinoData.split(' ');

    let arduinoMessage = {
        actionA: dataArray[0],
        actionB: dataArray[1],
        signal: parseInt(dataArray[2])
    }
    ioServer.emit('arduinoMessage', arduinoMessage);
    console.log(arduinoMessage);
 
});

/* 🔄 WEBSOCKET COMMUNICATION __________________________________________

1) Create the socket methods to listen the events and emit a response
It should listen for directions and emit the incoming data.*/

ioServer.on('connection', (socket) => {

    socket.on('orderForArduino', (orderForArduino) => {
        port.write(orderForArduino);
        console.log('orderForArduino: ' + orderForArduino);
    });

});

/* 🔄 HTTP COMMUNICATION ___________________________________________

2) Create an endpoint to POST user score and print it
_____________________________________________ */

app.post('/score', (request, response) =>{
    console.log(request.body);
    port.write('P');
    response.end();
})