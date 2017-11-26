export const HttpError = {
  400: (message = 'Bad Request') => {
    return {
      code: 401,
      message: message
    }
  },
  401: {
    code: 401,
    message: 'Unauthenticated / User unknown'
  },
  403: {
    code: 403,
    message: 'Access Denied'
  },
  404: (message = 'Record not found') => {
    return {
      status: 404,
      message: message
    }
  },
  500: (message = 'Database problem') => {
    return {
      status: 500,
      message: message
    }
  }
}