import {UserModel} from '../models/userModel'
import * as express from 'express'
import {HttpError} from "../config/errors";

const userRoutes = express.Router()

function stripAuthData(userWithAuth) {
  return {
    // id: userWithAuth._id,
    email: userWithAuth.email,
    name: userWithAuth.name,
    photoUrl: userWithAuth.photoUrl
  }
}


// Admin
userRoutes.get('/admin/users', (request: any, response: any) => {
  UserModel['getAllUsers'](request).then(users => response.send(users.map(stripAuthData)))
})

userRoutes.post('/admin/users', (request: any, response: any) => {
  UserModel['saveUser'](request)
  .then(() => response.status(200).send())
})

userRoutes.delete('/admin/users', (request: any, response: any) => {
  UserModel['deleteUser'](request)
  .then(() => response.status(200).send())
})


export {userRoutes}