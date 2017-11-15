import { Month } from '../models/monthModel'
import { User } from '../models/userModel'
import * as express from 'express'

let monthRoutes = express.Router()

monthRoutes.post('/availability/:year/:month', (req, res) => {

	req.body.days = JSON.parse(req.body.days)

	User.getUser(req, (err, currentUser) => {
		if(err) res.status(500).json({ err })
		Month.findOne({year:req.params.year,month:req.params.month},(err,month) => {
			if(err) res.status(500).json({ err })
			if(!month){
				let month = new Month()
				month.year = req.params.year
				month.month = req.params.month

				let user = month.availability.find(user => user.uid == currentUser.id)
				if(user == undefined) month.availability.push({uid:currentUser.uid,days:req.body.days})
				if(user) user.days = req.body.days

				month.save()
				console.log('month successfully added')
				res.send(req.body.days)
			}
			if(month){
				let user = month.availability.find(user => user.uid == currentUser.id)
				if(user == undefined) month.availability.push({uid:currentUser.uid,days:req.body.days})
				if(user) user.days = req.body.days
				month.save()
				console.log('month successfully updated')
				res.send(req.body.days)
			}
		})		
	})

})

monthRoutes.get('/availability/:year/:month',(req,res) => {

	User.getUser(req, (err, currentUser) => {
		if(err) res.status(500).json({err})
		Month.findOne({ year : req.params.year, month : req.params.month }, (err, month) => {
			if(err) res.status(500).json({err})
			if(!month) res.status(404).json({message:'There is no such month record'})
			let user = month.availability.find(user => user.uid == currentUser.id)
			if(user == undefined) res.status(404).json({message:'There is no such user'})
			if(user) res.send(user.days)
		})		
	})	
})

monthRoutes.get('/schedule/:year/:month',(req,res) => {

	User.getUser(req, (err, currentUser) => {
		if(err) res.status(500).json({err})
		Month.findOne({ year : req.params.year, month : req.params.month }, (err, month) => {
			if(err) res.status(500).json({err})
			if(!month) res.status(404).json({message:'There is no such month record'})
			let user = month.schedule.find(user => user.uid == currentUser.id)
			if(user == undefined) res.status(404).json({message:'There is no such user'})
			if(user) res.send(user.days)
		})		
	})	
})

monthRoutes.get('/admin/availability/:year/:month',(req,res) => {

	Month.findOne({ year : req.params.year, month : req.params.month }, (err, month) => {
		if(err) res.status(500).json({err})
		if(!month) res.status(404).json({message:'There is no such month record'})
		res.send(month.availability)
	})	
})

monthRoutes.get('/admin/schedule/:year/:month',(req,res) => {

	Month.findOne({ year : req.params.year, month : req.params.month }, (err, month) => {
		if(err) res.status(500).json({err})
		if(!month) res.status(404).json({message:'There is no such month record'})
		res.send(month.schedule)
	})	
})



monthRoutes.post('/admin/availability/:uid/:year/:month', (req, res) => {

	req.body.days = JSON.parse(req.body.days)
	console.log('request hitted')

	Month.findOne({year:req.params.year,month:req.params.month},(err,month) => {
		if(err) res.status(500).json({ err })
		if(!month){
			let month = new Month()
			month.year = req.params.year
			month.month = req.params.month

			let user = month.availability.find(user => user.uid == req.params.uid)
			if(user == undefined) month.availability.push({uid:req.params.uid,days:req.body.days})
				if(user) user.days = req.body.days

				month.save()
				console.log('month successfully added')
				res.send(req.body.days)
			}
			if(month){
				let user = month.availability.find(user => user.uid == req.params.uid)
				if(user == undefined) month.availability.push({uid:req.params.uid,days:req.body.days})
				if(user) user.days = req.body.days
				month.save()
				console.log('month successfully updated')
				res.send(req.body.days)
			}
		})

})

monthRoutes.post('/admin/schedule/:uid/:year/:month', (req, res) => {

	req.body.days = JSON.parse(req.body.days)
	
	Month.findOne({year:req.params.year,month:req.params.month},(err,month) => {
		if(err) res.status(500).json({ err })
		if(!month){
			let month = new Month()
			month.year = req.params.year
			month.month = req.params.month

			let user = month.schedule.find(user => user.uid == req.params.uid)
			if(user == undefined) month.schedule.push({uid:req.params.uid,days:req.body.days})
			if(user) user.days = req.body.days

			month.save()
			console.log('month successfully added')
			res.send(req.body.days)
		}
		if(month){
			let user = month.schedule.find(user => user.uid == req.params.uid)
			if(user == undefined) month.schedule.push({uid:req.params.uid,days:req.body.days})
			if(user) user.days = req.body.days
			month.save()
			console.log('month successfully updated')
			res.send(req.body.days)
		}
	})
})

export { monthRoutes }