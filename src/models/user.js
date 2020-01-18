const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task') // For cascdaded removal of tasks

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be non-negative')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password should not contain "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

// adding virtual property (explaining relation to dbms)
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

// method : cannot use arrow function
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.SECRET_KEY)
    
    user.tokens = user.tokens.concat({token})
    await user.save()
    
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login wp')
    }

    return user
}


// pre- before some operation. Here this operation is save
// Hence this middleware applies whenever we save an object
// note that this is the reason why we replaced single line
// call to findByIdandUpdate in the routers section to enable
// using save and middleware
// cannot use arrow function here since used internally
// code for hashing password before saving 
userSchema.pre('save', async function (next) {
    const user = this
    // console.log('just before saving')

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    // Important next otherwise it never terminates
    // as does not know when to update
    next()
})

// This middleware runs before removal of a user
userSchema.pre('remove', async function(next) {
    const user  = this

    await Task.deleteMany({ owner: user._id })
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User

// mongoose -> guide -> middleware : 
// allow process to take place at certain times
// ex. adding password hashing algorithm

// Without middleware code becomes simpler: 
//const User = mongoose.model('User', {<inside_schema>})