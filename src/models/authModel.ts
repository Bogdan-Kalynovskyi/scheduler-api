import {googleClientId} from "../config/config";

import * as mongoose from "mongoose";
import {HttpError} from "../config/errors";
const GoogleAuth = require('google-auth-library');


const tokenSchema = new mongoose.Schema({
  _id: String,       // googleUserId
  accessToken: String,
})


const googleAuth = new GoogleAuth;
const googleClient = new googleAuth.OAuth2(googleClientId, '', '');

tokenSchema.statics.verifyUser = (googleId, idToken, callback) => {
  googleClient.verifyIdToken(idToken, googleClientId,
  (err, login) => {
    if (err) {
      throw HttpError[500];
    }
    const user = login.getPayload();
    if (googleId === user.sub) {
      callback(user)
    }
    else {
      throw HttpError[401];
    }
  });
}


export const AuthModel = mongoose.model('Tokens', tokenSchema)
