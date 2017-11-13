import { User } from '../models/userModel';
import * as express from 'express';

import { createToken } from '../jwt'

let authRoutes = express.Router();

authRoutes.post('/authenticate',[createToken],(req,res,next) => {

  let user = new User({
    email:req.body.email,
    id:req.body.id,
    name:req.body.name,
    photoUrl:req.body.photoUrl
  })

  User.find({email:req.body.email},(err,foundUser) => {

    if(foundUser.length == 0){
      user.token = req.token
      user.expires = req.expires

      user.save((err,user) => {
        if(err)console.log('Error when trying to add user,check your mongo connection')
        console.log('user successfully added')
      })

      res.json(user)
    }else{
      console.log('user was found in db and returned')
      foundUser[0].token = req.token
      foundUser[0].expires = req.expires
      res.json(foundUser[0]);
    }
  });
})

// authRoutes.post('/loginFb',(req,res,next) => {
//   let user = new models.user({
//     name:req.body.name,
//     email:req.body.email
//   })
//   models.user.find({email:req.body.email},(err,foundUser) => {
//     if(foundUser.length == 0){
//       user.save((err,user) => {
//         if(err) return console.log('Error when trying to add user,check your mongo connection')
//         console.log('user successfully added')
//       })
//       res.json(user);
//     }else{
//       console.log('user is already registered')
//       res.json(foundUser[0]);
//     }
//   });
// })

export { authRoutes } 

