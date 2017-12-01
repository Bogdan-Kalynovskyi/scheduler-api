import * as mongoose from "mongoose"
import {HttpError} from "../config/errors";
import {Auth} from "./auth.model";

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

  static getDays(subject: string, year: number, month: number, googleId: string): Promise<any> {
    const query = {year, month}
    query[subject] = {
      _id: googleId
    }
    return MonthDb.findOne(query)
    .then((userDays) => {
      if (userDays) {
        return userDays
      }
      throw HttpError[404](`No ${subject} for this month`)
    })
  }


  static getUserDays(subject: string, request: any): Promise<any> {
    return this.getDays(subject, request.params.year, request.params.month, Auth.getUser(request).googleId)
  }


  static getAllAdminDays(subject: string, year: number, month: number): Promise<any> {
    return MonthDb.findOne({year, month})
    .then((monthObj) => {
      if (monthObj) {
        return monthObj[subject]
      }
      throw HttpError[404](`No ${subject} for this month`)
    })
  }


  static updateDays(subject: string, year: number, month: number, googleId: string, days: any): Promise<any> {
    return MonthDb.findOne({year, month})
    .then((monthObj) => {
      if (monthObj) {
        const userDays = monthObj[subject].find(record => record._id === googleId)
        if (userDays) {
          userDays.days = days
        }
        else {
          monthObj[subject].push({
            _id: googleId,
            days: days
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


  static updateUserDays(subject: string, request: any): Promise<any> {
    return this.updateDays(subject, request.params.year, request.params.month, Auth.getUser(request).googleId, request.body.days)
  }


  static updateAdminDays(subject: string, request: any): Promise<any> {
    return this.updateDays(subject, request.params.year, request.params.month, request.params.googleId, request.body.days)
  }
}

export const MonthDb = mongoose.model('Month', monthSchema)