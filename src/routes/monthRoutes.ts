import {MonthDb} from '../models/monthModel'
import {UserDb} from '../models/userModel'
import * as express from 'express'
import {HttpError} from "../config/errors";

const AVAILABILITY = 'availability';
const SCHEDULE = 'schedule';
const monthRoutes = express.Router()


monthRoutes.post('/availability/:year/:month', (request: any) => {
  updateUserDays(AVAILABILITY, request)
})

monthRoutes.get('/availability/:year/:month', (request: any, response: any) => {
  getUserDays(AVAILABILITY, request, response)
})

monthRoutes.get('/schedule/:year/:month', (request: any, response: any) => {
  getUserDays(SCHEDULE, request, response)
})


// Admin
monthRoutes.get('/admin/availability/:year/:month', (request: any, response: any) => {
  getAllAdminDays(AVAILABILITY, request, response)
})

monthRoutes.get('/admin/schedule/:year/:month', (request: any, response: any) => {
  getAllAdminDays(SCHEDULE, request, response)
})

monthRoutes.post('/admin/availability/:uid/:year/:month', (request: any) => {
  updateAdminDays(AVAILABILITY, request)
})

monthRoutes.post('/admin/schedule/:uid/:year/:month', (request: any) => {
  updateAdminDays(SCHEDULE, request)
})

export {monthRoutes}