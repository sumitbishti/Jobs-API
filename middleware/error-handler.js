const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    msg: err.message || 'Something went wrong!',
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  }

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  if (err.code && err.code == 11000) {
    customError.msg = `${err.keyValue.email} already exits!`
    customError.statusCode = 400
  }
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
