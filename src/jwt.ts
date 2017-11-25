import * as jwt from 'jwt-simple'
import {jwtSecret, sessionExpirationTime} from "./config/jwtConfig";
import {HttpError} from "./config/errors";


export function createToken(request, response, next) {
  request.expires = Date.now() + sessionExpirationTime
  request.token = jwt.encode({
    exp: request.expires,
    id: request.body.id
  }, jwtSecret)
  next()
}


export function jwtAuth(request, response, next) {
  const token = request.headers['x-access-token']
  if (token) {
    try {
      const decoded = jwt.decode(token, jwtSecret)
      if (decoded.exp < Date.now()) {
        response.sendStatus(498)
      }
      else {
        next()
      }
    } catch (err) {
      throw HttpError[400]('Token is invalid')
    }
  }
  else {
    throw HttpError[400]('There is no token')
  }
}
