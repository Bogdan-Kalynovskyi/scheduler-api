import * as mongoose from "mongoose"

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


export const MonthModel = mongoose.model('Month', monthSchema)