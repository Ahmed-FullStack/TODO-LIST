const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const date = require(__dirname + '/date.js')
const _ = require('lodash')
const app = express()
console.log(date.getDate())
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

mongoose.connect('mongodb://localhost:27017/todolistDB')

const listSchema = new mongoose.Schema({
	name: String,
})

const List = new mongoose.model('List', listSchema)

const listOne = new List({
	name: 'Buy Food',
})

const defaultList = [listOne]

const customListSchema = new mongoose.Schema({
	customListName: String,
	customListArray: [listSchema],
})

const customList = new mongoose.model('CustomList', customListSchema)

app.get('/', (req, res) => {
	List.find({}, (err, foundList) => {
		if (foundList.length === 0) {
			List.insertMany(defaultList, error => {
				if (!error) {
					console.log('Successfully Added List to the DB')
				} else {
					console.log(error)
				}
			})
			res.redirect('/')
		} else {
			res.render('list', { listTitle: date.getDate(), Items: foundList })
		}
	})
})

app.get('/:customURL', (req, res) => {
	const userCustomURL = _.capitalize(req.params.customURL)

	customList.findOne(
		{ customListName: userCustomURL },
		(err, customListUsers) => {
			if (!customListUsers) {
				const customListItem = new customList({
					customListName: userCustomURL,
					customListArray: defaultList,
				})

				customListItem.save()
				res.redirect('/' + userCustomURL)
			} else {
				res.render('list', {
					listTitle: customListUsers.customListName,
					Items: customListUsers.customListArray,
				})
			}
		}
	)
})

app.post('/', (req, res) => {
	const listHeading = req.body.titleOfList
	const inputText = req.body.input

	const eachItem = new List({
		name: inputText,
	})

	if (listHeading === date.getDate()) {
		eachItem.save()
		res.redirect('/')
	} else {
		customList.findOne(
			{ customListName: listHeading },
			(err, anotherCustomListUsers) => {
				anotherCustomListUsers.customListArray.push(eachItem)
				anotherCustomListUsers.save()
				res.redirect('/' + listHeading)
			}
		)
	}
})

app.post('/delete', (req, res) => {
	const idOfList = req.body.checkbox
	const deleteListTitle = req.body.deleteTitle

	if (deleteListTitle === date.getDate()) {
		List.findByIdAndRemove(idOfList, err => {
			if (!err) {
				res.redirect('/')
			} else if (err) {
				console.log(err)
			}
		})
	} else {
		customList.findOneAndUpdate(
			{ customListName: deleteListTitle },
			{ $pull: { customListArray: { _id: idOfList } } },
			(err, deletedFoundUsers) => {
				if (!err) {
					res.redirect('/' + deleteListTitle)
				} else {
					console.log(err)
				}
			}
		)
	}
})

app.listen(3000, () => {
	console.log('Server is Running On Port 3000')
})
