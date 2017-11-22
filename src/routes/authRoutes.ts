import {UserModel} from '../models/userModel';
import * as express from 'express';

import {createToken} from '../jwt'

export const authRoutes = express.Router();

authRoutes.post('/authenticate', [createToken], (request: any, response: any) => {

  UserModel.findOne({email: request.body.email})
  .then((user: any) => {
    if (user) {
      user.token = request.body.token
      user.expires = request.body.expires
    }
    else {
      user = new UserModel({
        _id: request.body.id,
        email: request.body.email,
        name: request.body.name,
        photoUrl: request.body.photoUrl,
        token: request.body.token,
        expires: request.body.expires
      })

      user.save()
      response.json(user)
    }
  });
})

