import {UserModel} from '../models/userModel';
import * as express from 'express';

import {createToken} from '../jwt'
import {HttpError} from "../config/errors";
import {sessionExpirationTime} from "../config/jwtConfig";

export const authRoutes = express.Router();


authRoutes.post('/authenticate', [createToken], (request: any, response: any) => {
  const userUpdate = {
    googleId: request.body.id,
    email: request.body.email,
    name: request.body.name,
    photoUrl: request.body.photoUrl,
    token: request.token,
    expires: Date.now() + sessionExpirationTime
  }
  UserModel.findOneAndUpdate({
    email: request.body.email
  }, userUpdate)
  .then((user) => {
    if (user) {
      response.status(200).send(UserModel['stripAuthData'](userUpdate))
    }
    else {
      throw HttpError[401]
    }
  })
})

