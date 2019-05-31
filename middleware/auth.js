const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next){

    //Get token from header
    const token = req.header('x-auth-token');

    //chequea si el token fue vencido
    if(!token){
        return res.status(401).json({msg: 'Autorización denegada, por no tener token'});
    }

    //verifica el token
    try {

        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
        
    } catch (err) {
        res.status(401).json({msg: 'Token no es valido'})
    }

}