import * as mongoose from "mongoose";
import {HttpError} from "../config/errors";
import {adminEmails} from "../config/config";

const userSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: String,
  protoUrl: String,
})

userSchema.index({googleId: 1})
userSchema.index({email: 1}, {unique: true})


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
    if (user.email in adminEmails) {
      return user
    }
    throw HttpError[403]
  })
}


userSchema.statics.getAllUsers = (request): Promise<any> => {
  if (this.ifAdmin(request)) {
    return this.find({email: {'$ne': adminEmails}})
  }
}


userSchema.statics.saveUser = (request): Promise<any> => {
  if (this.ifAdmin(request)) {
    return this.save({
      googleId: request.body.id,
      email: request.body.email,
      name: request.body.name,
      photoUrl: request.body.photoUrl,
    })
    .catch(() => {
      debugger;
      console.log(arguments);
      throw HttpError[400]('Trying to save the user twice?')
    })
  }
}


userSchema.statics.deleteUser = (request): Promise<any> => {
  if (this.ifAdmin(request)) {
    return this.delete({_id: request.body.uid})
    .then(res => console.log(res))
    // todo .catch  404
  }
}


userSchema.statics.stripAuthData = (userWithAuth) => {
  return {
    googleId: userWithAuth.googleId,
    email: userWithAuth.email,
    name: userWithAuth.name,
    photoUrl: userWithAuth.photoUrl,
    expires: userWithAuth.expires,
  }
}


export const UserModel = mongoose.model('User', userSchema)
