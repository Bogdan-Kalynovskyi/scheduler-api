import {UserDb} from '../models/userModel'
import * as express from 'express'
import {HttpError} from "../config/errors";

const userRoutes = express.Router()


// Admin
userRoutes.get('/admin/users', (request: any, response: any) => {
  UserDb['getAllUsers'](request)
  .then(users => response.send(users))
})

userRoutes.post('/admin/users', (request: any, response: any) => {
  UserDb['saveUser'](request)
  .then(() => response.status(204).send())
})

userRoutes.delete('/admin/users/:googleId', (request: any, response: any) => {
  UserDb['deleteUser'](request)
  .then(() => response.status(204).send())
})


export {userRoutes}