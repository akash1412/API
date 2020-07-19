const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}:${err.value}`;

    return new AppError(message, 400)
}

const sendErrorDev = (err, res) => {

    console.log({ name: err.name })
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


        if (err.name === 'CastError') err = handleCastErrorDB(err)

        sendErrorProd(err, res)

    }
}