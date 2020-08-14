const router = require('express').Router()
const Users = require('../models/user-model')
const restrict = require('../middlewares/restrict')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get('/', restrict('dean'), async (req, res, next) => {
	try {
		res.json(await Users.getAll())
	} catch (error) {
		next(error)
	}
})

router.get('/students', restrict('teacher'), async (req, res, next) => {
	try {
		res.json(await Users.getStudents())
	} catch (error) {
		next(error)
	}
})

router.get('/department', restrict('student'), async (req, res, next) => {
	try {
		const decode = jwt.decode(req.cookies.token) || req.headers
		const dept = await Users.getDepartment(decode.department)
		res.json(dept)
		// res.status(200).json({ message: decode });
	} catch (error) {
		next(error)
	}
})

router.post('/register', async (req, res, next) => {
	try {
		const { username, password, department, role, firstname, lastname } = req.body

		const user = await Users.findBy(username).first()

		if (user) {
			return res.status(409).json({ message: 'Username is already taken' })
		}

		const newUser = await Users.add({
			username,
			password: await bcrypt.hash(password, 10),
			department,
			role,
			firstname,
			lastname
		})

		res.status(201).json(newUser)
	} catch (error) {
		next(error)
	}
})

router.post('/login', async (req, res, next) => {
	try {
		const { username, password } = req.body
		const user = await Users.findBy(username).first()

		if (!user) {
			return res.status(401).json({
				message: 'Invalid Credentials 1'
			})
		}

		// hash the password again and see if it matches what we have in the database
		const passwordValid = await bcrypt.compare(password, user.password)

		if (!passwordValid) {
			return res.status(401).json({
				message: 'Invalid Credentials 2'
			})
		}
		const payload = {
			id: user.id,
			username: user.username,
			department: user.department,
			role: user.role // this value would usually come from the database
		}

		const token = await jwt.sign(payload, process.env.SECRET)
		res.cookie('token', token)
		res.json({
			message: `Welcome ${user.username}!`,
			id: user.id,
			token: token,
			role: user.role,
			department: user.department
		})
	} catch (err) {
		next(err)
	}
})

router.get('/logout', async (req, res, next) => {
	try {
		res.clearCookie('YOOOOO')
		res.clearCookie('token').end()
	} catch (err) {
		next(err)
	}
})

module.exports = router