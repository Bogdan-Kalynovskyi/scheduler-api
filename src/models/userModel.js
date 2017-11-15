import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name:String,
  email:String,
  id:String,
  photoUrl:String,
  token:String,
  expires:String
})

userSchema.statics.getUser = function(req, cb){
	return this.findOne({token:req.get('x-access-token')},cb)
}

export const User = mongoose.model('User',userSchema)