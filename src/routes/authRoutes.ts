import {UserModel} from '../models/userModel';
import * as express from 'express';
const crypto = require('crypto')

import {HttpError} from "../config/errors";
import {AuthModel} from "../models/authModel";
import {sessionExpirationTime} from "../config/config";


export const sessionAuth = function (request, response, next) {
  if (
      request.session.expires < Date.now() &&
      request.session.token === request.headers['x-access-token']
  ) {
    return next()
  }
  throw HttpError[401]
}

export const authRoutes = express.Router();


authRoutes.post('/authenticate', (request: any, response: any) => {
  AuthModel['verifyUser'](request.body.googleId, request.body.idToken,
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
          crypto.randomBytes(48, function(err, buffer) {
            if (err) {
              throw HttpError[500](err.message)
            }
            const token = buffer.toString('base64')
            const expires = Date.now() + sessionExpirationTime
            request.session.token = token
            request.session.expires = expires
            response.status(200).send({token, expires})
          });
        }
        else {
          throw HttpError[401]
        }
      })
  })
})


authRoutes.delete('/authenticate', (request: any, response: any) => {
  request.session.destroy((err) => {
    if (err) {
      throw HttpError[500](err.message)
    }
    else {
      response.status(200).send()
    }
  })
})

