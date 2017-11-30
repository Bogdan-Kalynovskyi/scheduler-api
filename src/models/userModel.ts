import * as mongoose from "mongoose"
import {HttpError} from "../config/errors"
import {adminEmails} from "../config/config"
import {static} from "express";

const userSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: String,
  protoUrl: String,
})

userSchema.index({googleId: 1}, {unique: true})
userSchema.index({email: 1}, {unique: true})


export class User {
  googleId: string
  name: string
  email: string
  protoUrl: string
}


export class UserModel {

  static getAllUsers(request): Promise<any> {
    if (request.session.isAdmin) {
      return UserDb.find({email: {'$ne': adminEmails}})
    }
    throw HttpError[403]
  }


  static saveUser(request): Promise<any> {
    if (request.session.isAdmin) {
      return UserDb.save({
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


  static deleteUser(request): Promise<any> {
    if (request.session.isAdmin) {
      return UserDb.remove({googleId: request.params.googleId})
      .then(res => {
        console.log(res)
        if (res.result.n === 0) {  // fuck mongoose
          throw HttpError[404]
        }
      })
    }
    throw HttpError[403]
  }
}


export const UserDb = mongoose.model('User', userSchema)
