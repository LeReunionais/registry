var registry = require('../registry');
var express = require('express');
var app = express();

app.set('views', './public');
app.set('view engine', 'jade');

app.get('/', (req, res) => {
    res.render('index', { services: registry.registry() });
});

module.exports = app;
