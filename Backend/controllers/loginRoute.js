const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {secret} = require('../utils/config')
const pool = require('../db')

loginRouter.post('/', async(req, res, next) => {
    try{
        const {username, password} = req.body
        
        if(!username || !password) {
            return res.status(400).json({error: 'Missing credentials'})
        }

        const user = await pool.query(
            `
            SELECT id, name, username, password, role FROM users WHERE username = $1
            `, [username]
        )

        const correctPassword = user.rows.length === 0 ? false : await bcrypt.compare(password, user.rows[0].password)

        if (!correctPassword) {
            return res.status(400).json({error: 'Invalid username or password'})
        }

        const userToken = {
            id: user.rows[0].id,
            username: user.rows[0].username
        }

        const token = jwt.sign(userToken, secret, {expiresIn: '2h'})
        res.status(201).json({token, username: user.rows[0].username, name: user.rows[0].name, role: user.rows[0].role})
    }catch(error){
        next(error)
    }
})

module.exports = loginRouter