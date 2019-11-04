const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: false
        });

        console.log("Mongo está conectado de la otra forma");

    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;