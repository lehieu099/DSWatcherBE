const express = require("express");

const cors = require("cors");

const app = express();

const db = require("./app/models");
db.sequelize.sync();

var corsOptions ={
    origin : "http://localhost:4200"
};

app.use(cors(corsOptions));

// paste requests of content-type -- application/json
app.use(express.json());

// paste requests of content-type -- application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

// simple route
app.get("/", (req, res) =>{
    res.json({ message: "DSWatcher - HieuLD"});
});

require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}.`);
});