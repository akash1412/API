const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
    console.log(err.name)
    const message = `Invalid ${err.path}:${err.value}`;

    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (err) => {
    // const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
    console.log(err.name)
    const value = err.keyValue.name

    const message = `Duplicate Feild value :[${value}]. Please use another value!`;

    return new AppError(message, 400);


}

const handleValidationErrorDB = (err) => {

    console.log(err.name)
    const errors = Object.values(err.errors).map(el => el.message)

    const message = `Invalid input data:${errors.join('. ')}`;
    return new AppError(message, 404)
}

const handleJwtError = () => {
    return new AppError('Invalid Token, Please login again', 401)
}

const handleTokenExpiredError = () => new AppError('Your Token has expired! Please login again.', 401)

const sendErrorDev = (err, res) => {


    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorProd = (err, res) => {
    // Operational trusted Error sent to the client


    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })

    } else {
        // UNKNOWN Programming Error occur,send this generic msg to client

        // 1) log Error 

        console.error('Error 💥', err)

        res.status(404).json({
            status: 'error',
            message: 'something went very wrong'
        })

    }

}


module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'


    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    } else if (process.env.NODE_ENV.trim() === 'production') {


        if (err.name === 'CastError') err = handleCastErrorDB(err)// this handle invalid id path
        if (err.code === 11000) err = handleDuplicateFieldsDB(err)    // this func handles duplicate fields error
        if (err.name === 'ValidationError') err = handleValidationErrorDB(err) // this func handles mongoose validation error
        if (err.name === 'JsonWebTokenError') err = handleJwtError()// this func handles JWT Error
        if (err.name === 'TokenExpiredError') err = handleTokenExpiredError()

        sendErrorProd(err, res);
    }
}