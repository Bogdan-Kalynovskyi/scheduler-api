import {HttpError} from '../config/errors'
import {googleClientId} from '../config/config'
import {User} from './user.model'

import {OAuth2Client} from 'google-auth-library'
const oAuth2Client = new OAuth2Client(googleClientId)


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


  static verifyUser(googleId, idToken): Promise<any> {
    return oAuth2Client.verifyIdToken({
      idToken: idToken,
      audience: googleClientId
    })
    .then((login) => {
      const user = login.getPayload()
      if (googleId === user.sub && googleClientId === user.aud && user.email_verified) {
        return {
          googleId: user.sub,
          email: user.email,
          name: user.name,
          photoUrl: user.picture
        }
      }
      throw HttpError[401]
    })
    .catch(() => {
      throw HttpError[401]
    })
  }

}