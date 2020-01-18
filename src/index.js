const express = require('express');
require('./db/mongoose');

const taskRouter = require('./routers/task');
const userRouter = require('./routers/user')

const app = express();
const port = process.env.PORT;

// ------------------ Middleware functions ----------------------
// this is an example of middleware 
// which disables GET requests 
// app.use((req,res,next) => {
//     if (req.method === 'GET') {
//         res.send('GET methods are disabled')
//     } else {
//         next()
//     }
// })
// 
// This middleware function is of general use (applies to all routes)
// app.use((req,res,next) => {
//     res.status(503).send('Sorry. Off for maintenance')
// })
// 
// Authentication middleware (in folder)
// ---------------------------------------------------------------

// To automatically convert info to json object
// whenever we get it through POST
app.use(express.json());
app.use(taskRouter);
app.use(userRouter);



app.listen(port, () => {
    console.log('Server is up at port ' + port);
});

// ------------- Entity - Relationship modeling ---------------
// This is possible but make mongodb understand our
// data relations, we make changes to task (**)
// const Task = require('./models/task')
// const User = require('./models/user')
// const main = async () => {
//     const task = await Task.findById('5e21e7a421ac8528b337d6ff')
//    // ** await task.populate('owner').execPopulate()
//     console.log(task.owner)
// }
// main()
// const main = async () => {
//     const user = await User.findById('5e21e6e521ac8528b337d6fd')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }
// main()
// --------------------------------------------------------------
    

// ------------------- web token generator ----------------------
// const jwt = require('jsonwebtoken')
// const myFunc = async () => {
//     const token = jwt.sign({_id: 'abc123'}, 'sbvudekds', {expiresIn: '1 day'})
//     console.log(token) sbvudeks - secretkey for tokens
//     const data = jwt.verify(token, 'sbvudekds')
//     console.log(data)
// }
// myFunc()
// --------------------------------------------------------------
    

// -------------------- Multer file uploads ---------------------
// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000   // size in bytes
//     },
//     fileFilter(req, file, cb) {
//         if (!file.filename.endsWith('.pdf')) {       // we can also use regex as f.f.match(/\.(doc|docx)$/)
//             return cb(new Error('Please upload a PDF'))
//         }
//         cb(undefined, true)
//         // cb(new Error('File must be a PDF'))      some error
//         // cb(undefined, true)                      no error, upload accepted
//         // cb(undefined, false)                     no error, upload rejected
//     }
// })
// app.post('/upload', upload.single('upload'), (req,res) => {
//     res.send()
// }, (error, req, res, next) => {
//      res.status(400).send({ error: error.message })
// })
// --------------------------------------------------------------


// Status code
// 500 server issues
// 400 validation failed
// 201 success