const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendFinalEmail } = require('../emails/account')

router.post('/users', async (req,res) => {
    const user = new User(req.body);

    try {
        await user.save() // token after valdation hence after saving
        sendWelcomeEmail(user.name, user.email)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((eachToken) => eachToken.token!=req.token)
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutall', auth, async (req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


router.get('/users/me', auth, async (req,res) => {
    res.send(req.user)
})
// try {
//     users = await User.find({});
//     res.send(users)
// } catch(e) {
//     res.status(500).send(e)
// }


router.patch('/users/me', auth, async (req,res) => {
    
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'password', 'email', 'age']

    if (!updates.every((update) => allowedUpdates.includes(update))) {
        return res.status(400).send({'error': 'Invalid Updates!'})
    }
    
    // new:true gives user the new/updated value of user
    const _id = req.user._id;
    try {
        // const user = await User.findById(_id) noauth

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        // const user = await User.findByIdAndUpdate(_id, req.body, {new:true, runValidators:true})
        // if (!user) {     noauth
        //     return res.status(404).send() 
        // }
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e) // Not account for server error, only for validation error
    }
})


router.delete('/users/me', auth, async (req,res) => {
    const _id = req.user._id

    try {
            await req.user.remove()     // middleware applied here
            res.send(req.user)
            sendFinalEmail(req.user.name, req.user.email)
        // following are lines required without authentication
        // const user = await User.findByIdAndDelete(_id)
        // if (!user) {
        //     return res.status(404).send()
        // }
        // res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})


const upload = multer({
    // dest: 'avatars',     // remove this to allow saving to user before multer saving to dest
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {

    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})


module.exports = router













//          METHODS FOR USERS
// Express does not use the return value of its 
// functions so it is legal to convert our callback
// functions to async.
// app.post('/users', (req,res) => {
//     const user = new User(req.body);
    
//     user.save().then(() => {
//         res.status(201).send(user);
//     }).catch((e) => {
//         res.status(400).send(e);
//     });
// });

// app.get('/users', (req,res) => {
//     User.find({}).then((users) => {
//         res.send(users);
//     }).catch((e) => {
//         res.status(500).send(e);
//     });
// });

// app.get('/users/:id', (req,res) => {
//     const _id = req.params.id;

//     User.findById(_id).then((user) => {
//         if (!user) {
//             return res.status(404).send();
//         }

//         res.send(user);
//     }).catch((e) => {
//         res.status(500).send(e);
//     })
// });


//  not required
// router.get('/users/:id', async (req,res) => {
//     const _id = req.params.id;

//     try {
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send(e);
//     } 
// })