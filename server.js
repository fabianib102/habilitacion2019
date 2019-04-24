const express = require("express");
const mongoose = require("mongoose");

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

//DB Config
const db = require('./config/keys').mongoURI;

//connect to MongoBD
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(()=> console.log('Mongo DB está conectado pa'))
    .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello MADAFACA'));

//use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));

