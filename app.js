var express = require('express');

var app = express();

app.use(express.static('static'));

app.get('/', function (req, res) {
    res.render('index');
});

var port = 3000;
console.log('Listening on port', port);
app.listen(port);
