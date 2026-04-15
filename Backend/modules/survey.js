const mongoose = require('mongoose')

const surveySchema = mongoose.Schema({
    title: {
        type: String,
        minlength: 10,
        maxlength: 50,
        required: true
    },
    description: {
        type: String,
        minlength: 10
    },
    status: {
        type: String,
        enum: ["draft", "open", "closed"],
        required: true,
        default: "draft"
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    questions: [
        {
            prompt: {
                type:String,
                minlength: 5,
                required: true  
            },
            options: [
                {
                    type: String,
                    required: true
                }
            ]
        }
  ]
})

surveySchema.index({title: 1, owner: 1}, {unique: true})

surveySchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  }
})

const Survey = mongoose.model('survey', surveySchema)
module.exports = Survey