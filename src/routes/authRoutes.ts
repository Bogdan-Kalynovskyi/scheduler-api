import {UserModel} from '../models/userModel';
import * as express from 'express';

import {createToken} from '../jwt'
import {HttpError} from "../config/errors";

export const authRoutes = express.Router();


authRoutes.post('/authenticate', [createToken], (request: any, response: any) => {
  UserModel.findOneAndUpdate({
    email: request.body.email
  }, {
    token: request.body.token,
    user: request.body.expires
  })
  .then((user) => {
    if (user) {
      response.status(200).render()
    }
    else {
      throw HttpError[401]
    }
  })
})

