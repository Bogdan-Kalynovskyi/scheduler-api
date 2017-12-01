import {UserModel} from '../models/user.model'
import * as express from 'express'

export const userRoutes = express.Router()


// Admin
userRoutes.get('/admin/users', (request: any, response: any, next) => {
  UserModel.getAllUsers(request)
  .then(users => response.send(users))
  .catch(next)
})

userRoutes.post('/admin/users', (request: any, response: any, next) => {
  UserModel.saveUser(request)
  .then(() => response.status(204).send())
  .catch(next)
})

userRoutes.delete('/admin/users/:googleId', (request: any, response: any, next) => {
  UserModel.deleteUser(request)
  .then(() => response.status(204).send())
  .catch(next)
})
