import {adminEmails, googleClientId} from "../config/config"
import * as express from 'express'
import csurf = require('csurf')

import {Auth} from '../models/auth.model'
import {UserDb} from '../models/user.model'
import {HttpError} from '../config/errors'

export const authRoutes = express.Router()


authRoutes.get('/authenticate', csurf(), (request: any, response: any) => {
  // this is a keep-alive request to not loose the session
  response.status(204).send()
})


authRoutes.post('/authenticate', csurf({ignoreMethods: ['POST'] }), (request: any, response: any) => {
  Auth.verifyUser(request.body.googleId, request.body.idToken,
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

