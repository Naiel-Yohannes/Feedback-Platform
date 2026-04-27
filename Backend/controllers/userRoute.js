const userRouter = require('express').Router()
const validator = require('validator')
const User = require('../modules/user')
const bcrypt = require('bcrypt')

userRouter.post('/', async(req, res, next) => {
   try{
     const {name, username, password, role} = req.body

        if(!name || !username || !password || !role) {
            return res.status(400).json({error: 'Missing credentials'})
        }

        if(!validator.isStrongPassword(password)){
            return res.status(400).json({error: 'Weak password'})
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const user = new User({
            name: name.toLowerCase(),
            username: username.toLowerCase(),
            passwordHash,
            role: role.toLowerCase()
        })

        const newUser = await user.save()
        res.status(201).json(newUser)
   }catch(error){
        next(error)
   }
})

module.exports = userRouter