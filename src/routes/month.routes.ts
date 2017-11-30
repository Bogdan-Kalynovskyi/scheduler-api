import {MonthModel} from '../models/month.model'
import * as express from 'express'
import {Auth} from '../models/auth.model'

const AVAILABILITY = 'availability';
const SCHEDULE = 'schedule';

export const monthRoutes = express.Router()


monthRoutes.post('/availability/:year/:month', (request: any, response: any) => {
  MonthModel.updateUserDays(AVAILABILITY, request)
  .then(() => response.status(204).send())
})

monthRoutes.get('/availability/:year/:month', (request: any, response: any) => {
  MonthModel.getUserDays(AVAILABILITY, request)
  .then((days) => response.send(days))
})

monthRoutes.get('/schedule/:year/:month', (request: any, response: any) => {
  MonthModel.getUserDays(SCHEDULE, request)
  .then((days) => response.send(days))
})


// Admin
monthRoutes.get('/admin/availability/:year/:month', Auth.isAdmin, (request: any, response: any) => {
  MonthModel.getAllAdminDays(AVAILABILITY, request, response)
  .then((days) => response.send(days))
})

monthRoutes.get('/admin/schedule/:year/:month', Auth.isAdmin, (request: any, response: any) => {
  MonthModel.getAllAdminDays(SCHEDULE, request, response)
  .then((days) => response.send(days))
})

monthRoutes.post('/admin/availability/:googleId/:year/:month', Auth.isAdmin, (request: any, response: any) => {
  MonthModel.updateAdminDays(AVAILABILITY, request)
  .then(() => response.status(204).send())
})

monthRoutes.post('/admin/schedule/:googleId/:year/:month', Auth.isAdmin, (request: any, response: any) => {
  MonthModel.updateAdminDays(SCHEDULE, request)
  .then(() => response.status(204).send())
})
