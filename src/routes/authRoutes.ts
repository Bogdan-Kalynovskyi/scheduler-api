import {UserModel} from '../models/userModel';
import * as express from 'express';

import {HttpError} from "../config/errors";
import {sessionExpirationTime} from "../config/config";
import {AuthModel} from "../models/authModel";

export const authRoutes = express.Router();


authRoutes.post('/authenticate', (request: any, response: any) => {
  AuthModel['verifyUser'](request.body.googleId, request.body.idToken, (user) => {
    const userUpdate = {
      googleId: user.id,
      email: user.email,
      name: user.name,
      photoUrl: user.picture,
      expires: Date.now() + sessionExpirationTime
    }
    UserModel.findOneAndUpdate({
      email: user.email
    }, userUpdate)
    .then((change) => {
      if (change) {
        response.status(200).send(userUpdate)
      }
      else {
        throw HttpError[401]
      }
    })
  })
})


authRoutes.delete('/authenticate/:googleId', (request: any, response: any) => {
  UserModel.remove({
    googleId: request.params.googleId
  })
  .then((change) => {
    if (change) {
      response.status(200).send()
    }
    else {
      throw HttpError[401]
    }
  })
})

