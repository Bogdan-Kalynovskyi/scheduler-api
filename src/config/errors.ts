export const HttpError = {
  401: {
    code: 401,
    message: 'Unauthenticated / User unknown'
  },
  403: {
    code: 403,
    message: 'Access Denied'
  },
  404: {
    status: 404,
    message: 'No such record'
  },
  500: {
    status: 500,
    message: 'Database problem'
  }
}