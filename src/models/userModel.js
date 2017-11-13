import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name:String,
  email:String,
  id:String,
  photoUrl:String,
  token:String,
  expires:String
})

export const User = mongoose.model('User',userSchema)