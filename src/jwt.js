import jwt from 'jwt-simple'
import moment from 'moment'
import jwtSecret from './config/jwtConfig'

export let  createToken = function(req,res,next){
    req.expires = moment().add(30,'seconds').valueOf();
    req.token = jwt.encode({
      exp:req.expires
    },'secret')
    next()
  }

export let jwtAuth = function (req,res,next){
    let token = req.headers['x-access-token'];
    if(token){
      try{
        let decoded = jwt.decode(token,'secret')
        if(decoded.exp < Date.now())res.sendStatus(498)
        else
        next()
      }catch(err){
        return res.json({
          message:'token is invalid'
        })
      }
    }else
    res.json({
      message:'there is no token'
    })
  }
