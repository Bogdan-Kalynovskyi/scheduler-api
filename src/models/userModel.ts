import * as mongoose from "mongoose";
import {HttpError} from "../config/errors";
import {ADMIN_EMAIL} from "../config/jwtConfig";

const userSchema = new mongoose.Schema({
  _id: String,
  name: String,
  email: String,
  protoUrl: String,
  token: String,
  expires: String
})

userSchema.index({email: 1})
userSchema.index({token: 1})


userSchema.statics.getLoggedUser = (request): Promise<any> => {
  return this.findOne({
    token: request.get('x-access-token')
  })
  .then((user) => {
    if (user) {
      return user
    }
    throw HttpError[401]
  })
}


// Admin
userSchema.statics.ifAdmin = (request): Promise<any> => {
  return this.getLoggedUser(request)
  .then((user) => {
    if (user.email === ADMIN_EMAIL) {
      return user
    }
    throw HttpError[401]
  })
}


userSchema.statics.getAllUsers = (request): Promise<any> => {
  if (this.ifAdmin(request)) {
    return this.find({email: {'$ne': ADMIN_EMAIL}})
  }
  throw HttpError[401]
}


userSchema.statics.saveUser = (request): Promise<any> => {
  if (this.ifAdmin(request)) {
    return this.save({
      _id: request.body.uid,
      email: request.body.email,
      name: request.body.name,
      photoUrl: request.body.photoUrl,
    })
  }
  throw HttpError[401]
}


userSchema.statics.deleteUser = (request): Promise<any> => {
  if (this.ifAdmin(request)) {
    return this.delete({_id: request.body.uid})
    //.catch  404
  }
  throw HttpError[401]
}


export const UserModel = mongoose.model('User', userSchema)