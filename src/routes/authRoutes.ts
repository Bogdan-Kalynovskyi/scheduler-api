import {UserModel} from '../models/userModel';
import * as express from 'express';

import {createToken} from '../jwt'
import {HttpError} from "../config/errors";
import {SESSION_EXPIRATION} from "../config/jwtConfig";

export const authRoutes = express.Router();


authRoutes.post('/authenticate', [createToken], (request: any, response: any) => {
  UserModel.findOneAndUpdate({
    email: request.body.email
  }, {
    token: request.body.token,
    expires: Date.now() + SESSION_EXPIRATION
  })
  .then((user) => {
    if (user) {
      response.status(200).send()
    }
    else {
      throw HttpError[401]
    }
  })
})

