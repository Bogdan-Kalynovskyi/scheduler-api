import {googleClientId} from "../config/config"
import * as express from 'express'
import csurf = require('csurf')
import GoogleAuth = require('google-auth-library')

import {UserModel} from '../models/userModel'
import {HttpError} from "../config/errors"


const googleAuth = new GoogleAuth
const googleClient = new googleAuth.OAuth2(googleClientId, '', '')


function verifyUser (googleId, idToken, callback) {
  googleClient.verifyIdToken(idToken, googleClientId, (err, login) => {
      if (err) {
        throw HttpError[500]('token verification failed')
      }
      const user = login.getPayload()
      if (googleId === user.sub && googleClientId === user.aud) {
        return callback(user)
      }

      throw HttpError[401]
    })
}


export const authRoutes = express.Router()


authRoutes.post('/authenticate', (request: any, response: any) => {
  verifyUser(request.body.googleId, request.body.idToken,
    (user) => {
      const userUpdate = {
        googleId: user.id,
        email: user.email,
        name: user.name,
        photoUrl: user.picture
      }
      UserModel.findOneAndUpdate({
        email: user.email
      }, userUpdate)
      .then((changed) => {
        if (changed) {
          const token = request.session.csrfSecret
          response.status(200).send({token})
        }
        else {
          throw HttpError[401]
        }
      })
  })
})


authRoutes.delete('/authenticate', csurf(), (request: any, response: any) => {
  request.session.destroy((err) => {
    if (err) {
      throw HttpError[500](err.message)
    }
    response.status(200).send()
  })
})

