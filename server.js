const express = require("express");
const connectDB = require("./config/db");
const path = require("path");


const app = express();

//connect to MongoBD
connectDB();

//Init Middleware
app.use(express.json({extended: false}));


//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));

app.use('/api/project', require('./routes/api/project'));

app.use('/api/risk', require('./routes/api/risk'));

app.use('/api/proyect-type', require('./routes/api/projectType'));

app.use('/api/proyect-subtype', require('./routes/api/projectSubType'));

app.use('/api/task', require('./routes/api/task'));

app.use('/api/client', require('./routes/api/client'));

app.use('/api/province', require('./routes/api/province'));

app.use('/api/location', require('./routes/api/location'));

app.use('/api/team', require('./routes/api/team'));

app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));

//Configuraciones para produccion
if(process.env.NODE_ENV === "production"){
    //server static 
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));

