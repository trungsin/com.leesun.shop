'use strict'
// const StatusCode = {
//     FORBIDDEN: 403,
//     CONFLICT: 409
// }

// const ResponseStatusCode = {
//     FORBIDDEN: 'Bad request error',
//     CONFLICT: 'Conflict error'
// }
const {
    StatusCodes, 
    ReasonPhrases
} = require('../utils/httpStatusCode')
class ErrorResponse extends Error{
    constructor(message, status){
        super(message)
        this.status = status
    }
}
class ConflictRequestError extends ErrorResponse{
    constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.CONFLICT){
        super(message, statusCode)
    }
}
class BadRequestError extends ErrorResponse{
    constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.CONFLICT){
        super(message, statusCode)
    }
}
class AuthFailureError extends ErrorResponse{
    constructor(message =  ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED){
        super(message, statusCode)
    }
}

class AuthNotFoundError extends ErrorResponse{
    constructor(message =  ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND){
        super(message, statusCode)
    }
}
class ForbiddenError extends ErrorResponse{
    constructor(message =  ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN){
        super(message, statusCode)
    }
}
module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    AuthNotFoundError,
    ForbiddenError
}