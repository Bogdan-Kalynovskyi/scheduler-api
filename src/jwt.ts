import * as jwt from 'jwt-simple'
import {sessionSecret, sessionExpirationTime} from "./config/config";
import {HttpError} from "./config/errors";


export function jwtAuth(request, response, next) {
  const token = request.headers['x-access-token']
  if (token) {
   next() // todo
  }
  else {
    throw HttpError[400]('There is no token')
  }
}
