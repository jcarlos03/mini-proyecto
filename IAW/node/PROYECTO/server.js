var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var app = express();
var http = require("http");
var session = require('express-session');

app.use(session({
  secret: 'la33',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.engine('handlebars', exphbs.create({ defaultLayout: 'main' }).engine);
app.set('view engine', 'handlebars');

var users = [{ username: 'Fernando Alonso', password: '33' }];
let comentarios = [];

app.use((req, res, next) => {
  res.locals.username = req.session.username;
  next();
});

app.get('/', (req, res) => {
  res.render('login', { title: 'Inicio de Sesión', layout: false });
});

app.post('/login', (req, res) => {
  var { username, password } = req.body;
  var user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    req.session.username = username;
    res.redirect('/visualizar');
  } else {
    res.send('Inicio de sesión fallido. Inténtelo de nuevo.');
  }
});

app.get('/escribir-comentarios', (req, res) => {
  res.render('escribir-comentarios', { title: 'Escribir Comentario' });
});

app.post('/visualizar', (req, res) => {
  var { nuevosComentarios } = req.body;
  comentarios.push(nuevosComentarios);
  console.log(comentarios);
  res.redirect('/visualizar');
});

app.get('/visualizar', (req, res) => {
  res.render('visualizar', { title: 'Comentarios', comentarios });
});

app.get('/logout', (req, res) => {
  req.session.destroy(); 
  res.redirect('/');
});

http.createServer(app).listen(3000);