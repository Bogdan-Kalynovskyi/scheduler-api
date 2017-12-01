import GoogleAuth = require('google-auth-library')

import {HttpError} from '../config/errors';
import {googleClientId} from '../config/config';
import {User} from './user.model';


const googleAuth = new GoogleAuth
const googleClient = new googleAuth.OAuth2(googleClientId, '', '')

export class Auth {

  static getUser(request): User {
    if (request.session) {
      return request.session.user
    }
    throw HttpError[401]
  }

  static isAdmin(request, response?, next?): boolean {
    if (request.session) {
      const isAdmin = request.session.isAdmin
      if (next) {
        if (isAdmin) {
          return next()
        }
        else {
          throw HttpError[403]
        }
      }

      return isAdmin
    }
    throw HttpError[401]
  }

  static verifyUser (googleId, idToken, callback) {
    googleClient.verifyIdToken(idToken, googleClientId, (err, login) => {
      if (err) {
        return callback(err)
      }
      const user = login.getPayload()
      if (googleId === user.sub && googleClientId === user.aud && user.email_verified) {
        return callback(null, {
          googleId: user.sub,
          email: user.email,
          name: user.name,
          photoUrl: user.picture
        })
      }

      callback(HttpError[401])
    })
  }

}