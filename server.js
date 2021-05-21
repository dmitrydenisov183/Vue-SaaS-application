var express = require('express');
var path = require('path');
var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(path.join(__dirname + '/dist')));

app.get('*', function (request, response){
    response.sendFile(path.join(__dirname, 'dist/index.html'))
});
app.listen(port, function() {
console.log('Our app is running on http://localhost:' + port);
});