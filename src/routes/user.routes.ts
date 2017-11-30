import {UserModel} from '../models/user.model'
import * as express from 'express'

export const userRoutes = express.Router()


// Admin
userRoutes.get('/admin/users', (request: any, response: any) => {
  UserModel.getAllUsers(request)
  .then(users => response.send(users))
})

userRoutes.post('/admin/users', (request: any, response: any) => {
  UserModel.saveUser(request)
  .then(() => response.status(204).send())
})

userRoutes.delete('/admin/users/:googleId', (request: any, response: any) => {
  UserModel.deleteUser(request)
  .then(() => response.status(204).send())
})
