const mongoose = require('mongoose')

const responseSchema = mongoose.Schema({
    surveyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Survey', 
        required: true
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true            
    },
    answers: [
        {
            questionId: { 
                type: mongoose.Schema.Types.ObjectId,
                required: true 
            },
            selectedOption: { 
                type: Number,
                required: true, 
                min: 0 
            }
        }
    ]
})

responseSchema.index({surveyId: 1, submittedBy: 1}, {unique: true})

responseSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  }
})

const Response = mongoose.model('Response', responseSchema)
module.exports = Response