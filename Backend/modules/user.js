const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    username: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["coordinator", "member"],
        required: true,
    }
})


userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    delete ret.passwordHash
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User