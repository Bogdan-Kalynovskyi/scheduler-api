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


authRoutes.post('/authenticate', csurf({ignoreMethods: ['POST'] }), (request: any, response: any, next) => {
  Auth.verifyUser(request.body.googleId, request.body.idToken,
  (err, user) => {
    if (err) {
      return next(err)
    }
  
    UserDb.findOneAndUpdate({
      email: user.email
    }, user)
    .then((changed) => {
      if (changed) {
        request.session.user = user
        const isAdmin = (adminEmails.indexOf(user.email) !== 1)
        request.session.isAdmin = isAdmin
        const token = request.csrfToken()
        response.status(201).send({token, isAdmin})
      }
      else {
        return next(HttpError[401])
      }
    })
    .catch(next)
  })
})


authRoutes.delete('/authenticate', csurf(), (request: any, response: any, next) => {
  request.session.destroy((err) => {
    if (err) {
      return next(err)
    }
    response.status(204).send()
  })
})
