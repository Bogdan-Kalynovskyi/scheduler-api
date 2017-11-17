
import * as mongoose from "mongoose";

const userDaysSchema = new mongoose.Schema({
  _id: String,    // is uid
  days: [Number]
})

const monthSchema = new mongoose.Schema({
  year: Number,
  month: Number,
  schedule: [userDaysSchema],
  availability: [userDaysSchema]
})

monthSchema.index({year: 1, month: 1}, {unique: true});

// monthSchema.statics.getMonth = (request): Promise<any> => {
//   return this.findOne({
//     year: request.params.year,
//     month: request.params.month
//   })
//   .then((month) => {
//     if (!month) {
//       throw {
//         code: 404,
//         message: 'There is no such user'
//       }
//     }
//     else {
//       return month;
//     }
//   })
// }


export const MonthModel = mongoose.model('Month', monthSchema)