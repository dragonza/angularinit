var express = require('express'),
    app = express();

app.set('views', './www');
app.use(express.static('./www'));

app.get('/', function(req, res) {
    res.render('index', {});
});

console.log('Server is running at localhost:7016...');
app.listen(7016);