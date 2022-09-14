require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT // 5000;

// database connection
require("./database/connection");

// routes prefix
app.use('/api', require('./routes/routes'));

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(__dirname+'/dist'));
    app.get('*', (req, res) => {
        res.sendFile(__dirname+"/dist/index.html");
    })
}

//start server
app.listen(port, () => console.log('server running'));