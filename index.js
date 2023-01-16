const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var cors = require('cors');
const app = express();
const http = require('http')

const { Server } = require("socket.io");


let port = 1234;

const server = http.createServer(app); 
const io = new Server(server, {
  cors,
});

app.set("view engine", "ejs");
app.use("/static", express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));




const URI = 'mongodb+srv://robaa40:Lahaja40@cluster0.s4lbjfg.mongodb.net/?retryWrites=true&w=majority';
mongoose.set("strictQuery", false);

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { console.log("Successfully connected to MongoDB.") })
  .catch((error) => { console.log("Error connecting to MongoDB: " + error) });

  module.exports = { app, io };
  const auth = require('./routes/authentication.route');
  const product = require('./routes/product.route'); // Imports routes for the products
  app.use('/products', product);
  app.use('/auth', auth);


  io.on("connection", (socket) => {
    console.log("A user connected :)");
    socket.on("msg", console.log);
  
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  });

// other code here
server.listen(port, () => console.log('Server listening on port', port));
