import * as jwt from 'jwt-simple'
import {JWT_SECRET} from "./config/jwtConfig";


export function createToken(req, res, next) {
  req.expires = Date.now() + 999000;
  req.token = jwt.encode({
    exp: req.expires
  }, JWT_SECRET)
  next()
}


export function jwtAuth(req, res, next) {
  let token = req.headers['x-access-token'];
  if (token) {
    try {
      let decoded = jwt.decode(token, JWT_SECRET)
      if (decoded.exp < Date.now()) res.sendStatus(498)
      else
        next()
    } catch (err) {
      return res.json({
        message: 'token is invalid'
      })
    }
  } else
    res.json({
      message: 'there is no token'
    })
}
