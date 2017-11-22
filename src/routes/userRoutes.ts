import {UserModel} from '../models/userModel'
import * as express from 'express'
import {HttpError} from "../config/errors";

const userRoutes = express.Router()


// Admin
monthRoutes.get('/admin/users', (request: any, response: any) => {
  UserModel['getAllUsers'](request).then(users => response.send(users))
})

monthRoutes.post('/admin/users', (request: any, response: any) => {
  UserModel['saveUser'](request)// TODO UID .then(users => response.send(users))
})

monthRoutes.delete('/admin/users', (request: any, response: any) => {
  UserModel['deleteUser'](request)
})


export {userRoutes}