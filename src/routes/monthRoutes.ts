import {MonthModel} from '../models/monthModel'
import {UserModel} from '../models/userModel'
import * as express from 'express'
import {HttpError} from "../config/errors";

const AVAILABILITY = 'availability';
const SCHEDULE = 'schedule';
const monthRoutes = express.Router()


function getDays(subject: string, request: any, response: any, uid: string): Promise<any> {
  let query = {
    year: request.params.year,
    month: request.params.month
  }
  query[subject] = {
    _id: uid
  }
  return MonthModel.findOne()
  .then((userDays) => {
    if (userDays) {
      return response.send(userDays)
    }
    throw HttpError[404]
  })
}


function getUserDays(subject: string, request: any, response: any): Promise<any> {
  return UserModel['getLoggedUser'](request)
  .then((user) => {
    return getDays(subject, request, response, user._id);
  })
}


function getAllAdminDays(subject: string, request: any, response: any): Promise<any> {
  return MonthModel.findOne({
    year: request.params.year,
    month: request.params.month
  })
  .then((month) => {
    if (month) {
      return response.send(month[subject])
    }
    throw HttpError[404]
  })
}


function updateDays (subject: string, request: any, uid: string): Promise<any> {
  console.log(request.body.days);

  return MonthModel.findOne({
    year: request.params.year,
    month: request.params.month
  })
  .then((month: any) => {
    if (month) {
      const userDays = month[subject].find(record => record._id === uid)
      if (userDays) {
        userDays.days = request.body.days
      }
      else {
        month[subject].push({
          _id: uid,
          days: request.body.days
        })
      }
      month.save()
    }
    else {
      const model = new MonthModel({
        year: request.params.year,
        month: request.params.month
      })
      model[subject] = [{
        _id: uid,
        days: request.body.days
      }]

      model.save()
    }
  })
}


// User
function updateUserDays(subject: string, request): Promise<any> {
  return UserModel['getLoggedUser'](request)
  .then((user) => {
    return updateDays(subject, request, user._id);
  })
}


function updateAdminDays(subject: string, request): Promise<any> {
  return UserModel['ifAdmin'](request)
  .then((user) => {
    return updateDays(subject, request, user._id);
  })
}


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