import * as mongoose from "mongoose";
import {MyError} from "../config/errors";
import {ADMIN_EMAIL} from "../config/jwtConfig";

const userSchema = new mongoose.Schema({
  _id: String,
  name: String,
  email: String,
  token: String,
  expires: String
})


userSchema.methods.getLoggedUser = (request): Promise<any> => {
  return this.findOne({
    token: request.get('x-access-token')
  })
  .then((user) => {
    if (!user) {
      throw MyError[401];
    }
    else {
      return user;
    }
  })
}


userSchema.methods.ifAdmin = (request): Promise<any> => {
  return this.getLoggedUser(request)
  .then((user) => {
    if (user.email === ADMIN_EMAIL) {
      return user;
    }
    else {
      throw MyError[401];
    }
  })
}



export const UserModel = mongoose.model('User', userSchema)