const userRouter = require('express').Router()
const validator = require('validator')
const bcrypt = require('bcrypt')
const pool = require('../db')

userRouter.post('/', async(req, res, next) => {
   try{
     const {name, username, password, role} = req.body

        if(!name || !username || !password || !role) {
            return res.status(400).json({error: 'Missing credentials'})
        }

        if(!validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })){
            return res.status(400).json({
                error: 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character'
            })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = await pool.query(
            `
            INSERT INTO users (name, username, password, role)
            VALUES ($1, $2, $3, $4)
            RETURNING username, name, role
            `, [name.toLowerCase(), username.toLowerCase(), passwordHash, role.toLowerCase()]
        )
        res.status(201).json(newUser.rows[0])
   }catch(error){
        next(error)
   }
})

module.exports = userRouter