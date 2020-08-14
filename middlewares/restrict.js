const jwt = require('jsonwebtoken')
const { json } = require('express')

const roles = [ 'student', 'teacher', 'dean' ]

function restrict(role) {
	return async (req, res, next) => {
		const authError = { message: 'Invalid Credentials' }
		try {
			// const token = req.cookies.token;
			// const token = req.session;
			// const token = req.headers.authorization;
			const token = req.headers.authorization || req.cookies.token
			console.log(token)
			if (!req.session && !req.session.user) {
				return res.status(401).json(authError)
			}

			jwt.verify(token, process.env.SECRET, (err, decoded) => {
				if (err) {
					return res.status(401).json(authError)
				}

				if (role && roles.indexOf(decoded.role) < roles.indexOf(role)) {
					return res.status(401).json({ message: "You don't have access to this feature." })
				}
				next()
			})
		} catch (error) {
			console.log('Hello')
			next(error)
		}
	}
}

module.exports = restrict