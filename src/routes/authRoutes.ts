import {UserModel} from '../models/userModel';
import * as express from 'express';

import {createToken} from '../jwt'
import {HttpError} from "../config/errors";
import {sessionExpirationTime} from "../config/jwtConfig";

export const authRoutes = express.Router();


authRoutes.post('/authenticate', [createToken], (request: any, response: any) => {
  UserModel.findOneAndUpdate({
    email: request.body.email
  }, {
    googleId: request.body.id,
    token: request.token,
    expires: Date.now() + sessionExpirationTime
  })
  .then((user) => {
    if (user) {
      response.status(200).send({
        googleId: request.body.id,
        email: request.body.email,
        expires: Date.now() + sessionExpirationTime
      })
    }
    else {
      throw HttpError[401]
    }
  })
})

