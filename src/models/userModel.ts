import * as mongoose from "mongoose"
import {HttpError} from "../config/errors"
import {adminEmails} from "../config/config"

const userSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: String,
  protoUrl: String,
})

userSchema.index({googleId: 1})
userSchema.index({email: 1}, {unique: true})


userSchema.statics.getLoggedUser = (request) => {
  if (request.session) {
    return request.session.user
  }
  throw HttpError[401]
}


userSchema.statics.getAllUsers = (request): Promise<any> => {
  if (request.session.isAdmin) {
    return this.find({email: {'$ne': adminEmails}})
  }
  throw HttpError[403]
}


userSchema.statics.saveUser = (request): Promise<any> => {
  if (request.session.isAdmin) {
    return this.save({
      googleId: request.body.googleId,
      email: request.body.email,
      name: request.body.name,
      photoUrl: request.body.photoUrl,
    })
    .catch(() => {
      console.log(arguments);
      throw HttpError[400]('Trying to save the user twice?')
    })
  }
  throw HttpError[403]
}


userSchema.statics.deleteUser = (request): Promise<any> => {
  if (request.session.isAdmin) {
    return this.delete( {googleId: request.body.googleId} )
    .then(res => console.log(res))
    // todo .catch  404
  }
  throw HttpError[403]
}


export const UserModel = mongoose.model('User', userSchema)
