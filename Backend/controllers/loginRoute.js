const loginRouter = require('express').Router()
const User = require('../modules/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {secret} = require('../utils/config')

loginRouter.post('/', async(req, res, next) => {
    try{
        const {username, password} = req.body
        
        if(!username || !password) {
            return res.status(400).json({error: 'Missing credentials'})
        }

        const user = await User.findOne({username: username.toLowerCase()})

        const correctPassword = user === null ? false : await bcrypt.compare(password, user.passwordHash)

        if (!correctPassword) {
            return res.status(400).json({error: 'Invalid username or password'})
        }

        const userToken = {
            id: user._id,
            username: user.username
        }

        const token = jwt.sign(userToken, secret, {expiresIn: '2h'})
        res.status(201).json({token, username: user.username, name: user.name, role: user.role})
    }catch(error){
        next(error)
    }
})

module.exports = loginRouter