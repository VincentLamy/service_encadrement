require('dotenv').config();
const express = require('express');

const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true }));

app.use(express.json());
const port = process.env.PORT || 5000;

// routes prefix
app.use('/api', require('./routes/routes'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname + '/dist'));
    app.get('*', (req, res) => {
        res.sendFile(__dirname + "/dist/index.html");
    })
}

//start server
app.listen(port, () => console.log('server running'));