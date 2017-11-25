import * as jwt from 'jwt-simple'
import {JWT_SECRET, SESSION_EXPIRATION} from "./config/jwtConfig";


export function createToken(request, response, next) {
  request.expires = Date.now() + SESSION_EXPIRATION
  request.token = jwt.encode({
    exp: request.expires
  }, JWT_SECRET)
  next()
}


export function jwtAuth(request, response, next) {
  const token = request.headers['x-access-token']
  if (token) {
    try {
      const decoded = jwt.decode(token, JWT_SECRET)
      if (decoded.exp < Date.now()) {
        response.sendStatus(498)
      }
      else {
        next()
      }
    } catch (err) {
      return response.json({
        message: 'token is invalid'
      })
    }
  }
  else {
    response.json({
      message: 'there is no token'
    })
  }
}
