import * as mongoose from "mongoose"
import {UserDb, UserModel} from "./userModel";
import {HttpError} from "../config/errors";

const userDaysSchema = new mongoose.Schema({
  _id: String,    // is uid
  days: [Number]
})

const monthSchema = new mongoose.Schema({
  year: Number,
  month: Number,
  availability: [userDaysSchema],
  schedule: [userDaysSchema],
})

monthSchema.index({year: 1, month: 1}, {unique: true});
// monthSchema.index({'availability._id': 1}, {unique: true});
// monthSchema.index({'schedule._id': 1}, {unique: true});


export class MonthModel {
  static db = MonthDb

static getDays(subject: string, year: number, month: number, googleId: string): Promise<any> {
  const query = {year, month}
  query[subject] = {
    _id: googleId
  }
  return this.db.findOne()
  .then((userDays) => {
    if (userDays) {
      return userDays
    }
    throw HttpError[404]
  })
}


static getUserDays(subject: string, request: any): Promise<any> {
  return UserModel.getLoggedUser(request)
  .then((user) => {
    return this.getDays(subject, request.params.year, request.params.month, user.googleId);
  })
}


static getAllAdminDays(subject: string, year: number, month: number): Promise<any> {
  return MonthDb.findOne({year, month})
  .then((monthObj) => {
    if (monthObj) {
      return monthObj[subject]
    }
    throw HttpError[404]
  })
}


static updateDays(subject: string, year: number, month: number, googleId: string, days: any): Promise<any> {
  return MonthDb.findOne({year, month})
  .then((monthObj) => {
    if (monthObj) {
      const userDays = monthObj[subject].find(record => record._id === googleId)
      if (userDays) {
        userDays.days = request.body.days
      }
      else {
        monthObj[subject].push({
          _id: googleId,
          days: request.body.days
        })
      }
      monthObj.save()
    }
    else {
      const model = new MonthDb({year, month})
      model[subject] = [{
        _id: googleId,
        days: days
      }]

      model.save()
    }
  })
}


// User
static updateUserDays(subject: string, request: any): Promise<any> {
  if ( ) {
    return this.updateDays(subject, request, UserModel.getLoggedUser(request).googleId);
  })
}


static updateAdminDays(subject: string, request: any): Promise<any> {
  if (request.session.isAdmin) {
    return updateDays(subject, request, user._id);
  })
}


export const MonthDb = mongoose.model('Month', monthSchema)