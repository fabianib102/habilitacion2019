const express = require("express");
const connectDB = require("./config/db");

const app = express();

//connect to MongoBD
connectDB();

//Init Middleware
app.use(express.json({extended: false}));

app.get('/', (req, res) => res.send('Hello MADAFACA'));


//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));

app.use('/api/project', require('./routes/api/project'));

app.use('/api/risk', require('./routes/api/risk'));

app.use('/api/proyect-type', require('./routes/api/projectType'));

app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));

