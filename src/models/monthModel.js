import mongoose from 'mongoose'

const uidSchema = new mongoose.Schema({
	uid:String,
	days:[Number]
})

const monthSchema = new mongoose.Schema({
	year:Number,
	month:Number,
  schedule:[uidSchema],
  availability:[uidSchema]
})

export const Month = mongoose.model('Month',monthSchema)