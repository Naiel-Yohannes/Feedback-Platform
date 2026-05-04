const User = require('../modules/user')
const jwt = require('jsonwebtoken')
const {secret} = require('../utils/config')

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('Authorization')
    if(authorization && authorization.startsWith('Bearer')){
        req.token = authorization.replace('Bearer ', '')
    }else{
        req.token = null
    }
    next()
}

const userExtractor = async (req, res, next) => {
    try {
        if(!req.token) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        const decoded = jwt.verify(req.token, secret)
        if (!decoded || !decoded.id) {
            return res.status(401).json({error: 'Invalid token'})
        }

        const user = await User.findById(decoded.id)
        if(!user){
            return res.status(401).json({error: 'User not found'})
        }

        req.user = user
        next()
    }catch(error){
        next(error)
    }
}

const requireRole = (role) => {
    return (req, res, next) => {
        try {
            if(!req.user){
                return res.status(401).json({error: 'Unauthorized'})
            }
            if(req.user.role !== role){
                return res.status(403).json({error: 'Forbidden'})
            }
            next()

        }catch(error){
            next(error)
        }
    }
}

module.exports = { tokenExtractor, userExtractor, requireRole }