const mongoose = require('mongoose')
//const validator = require('validator')


const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task











// using without schema

// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         trim: true,
//         required: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     },
//     owner: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: 'User'
//     }
// })

// const firstTask = new Task({
//     description: 'Code with Sabale  ',
//     completed: false
// })

// firstTask.save().then(() => {
//     console.log(firstTask)
// }).catch((error) => {
//     console.log('Error occurred: ', error)
// })

// const me = new User({
//     name: '  Icpc Master  ',
//     email: 'EMAil@ini.com ',
//     password: 'pass'
// })

// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log('Error:', error)
// })