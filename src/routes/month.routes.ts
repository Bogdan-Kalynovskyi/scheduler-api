import {MonthModel} from '../models/month.model'
import * as express from 'express'
import {Auth} from '../models/auth.model'

const AVAILABILITY = 'availability';
const SCHEDULE = 'schedule';

export const monthRoutes = express.Router()


monthRoutes.post('/availability/:year/:month', (request: any, response: any, next) => {
  MonthModel.updateUserDays(AVAILABILITY, request)
  .then(() => response.status(204).send())
  .catch(next)
})

monthRoutes.get('/availability/:year/:month', (request: any, response: any, next) => {
  MonthModel.getUserDays(AVAILABILITY, request)
  .then((days) => response.send(days))
  .catch(next)
})

monthRoutes.get('/schedule/:year/:month', (request: any, response: any, next) => {
  MonthModel.getUserDays(SCHEDULE, request)
  .then((days) => response.send(days))
  .catch(next)
})


// Admin
monthRoutes.get('/admin/availability/:year/:month', Auth.isAdmin, (request: any, response: any, next) => {
  MonthModel.getAllAdminDays(AVAILABILITY, request, response)
  .then((days) => response.send(days))
  .catch(next)
})

monthRoutes.get('/admin/schedule/:year/:month', Auth.isAdmin, (request: any, response: any, next) => {
  MonthModel.getAllAdminDays(SCHEDULE, request, response)
  .then((days) => response.send(days))
  .catch(next)
})

monthRoutes.post('/admin/availability/:googleId/:year/:month', Auth.isAdmin, (request: any, response: any, next) => {
  MonthModel.updateAdminDays(AVAILABILITY, request)
  .then(() => response.status(204).send())
  .catch(next)
})

monthRoutes.post('/admin/schedule/:googleId/:year/:month', Auth.isAdmin, (request: any, response: any, next) => {
  MonthModel.updateAdminDays(SCHEDULE, request)
  .then(() => response.status(204).send())
  .catch(next)
})
