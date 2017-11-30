import {adminEmails, googleClientId} from "../config/config"
import * as express from 'express'
import csurf = require('csurf')
import GoogleAuth = require('google-auth-library')

import {UserDb} from '../models/userModel'
import {HttpError} from '../config/errors'


const googleAuth = new GoogleAuth
const googleClient = new googleAuth.OAuth2(googleClientId, '', '')


function verifyUser (googleId, idToken, callback) {
  googleClient.verifyIdToken(idToken, googleClientId, (err, login) => {
      if (err) {
        throw HttpError[500]('unexpected error in token verification')
      }
      const user = login.getPayload()
      if (googleId === user.sub && googleClientId === user.aud && user.email_verified) {
        return callback({
          googleId: user.sub,
          email: user.email,
          name: user.name,
          photoUrl: user.picture
        })
      }

      throw HttpError[401]
    })
}


export const authRoutes = express.Router()


authRoutes.get('/authenticate', csurf(), (request: any, response: any) => {
  // this is a keep-alive request to not loose the session
  response.status(204).send()
})


authRoutes.post('/authenticate', csurf({ignoreMethods: ['POST'] }), (request: any, response: any) => {
  verifyUser(request.body.googleId, request.body.idToken,
    (user) => {
      UserDb.findOneAndUpdate({
        email: user.email
      }, user)
      .then((changed) => {
        if (changed) {
          request.session.user = user
          const isAdmin = user.email in adminEmails
          request.session.isAdmin = isAdmin
          const token = request.csrfToken()
          response.status(201).send({token, isAdmin})
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
    response.status(204).send()
  })
})

