const express = require('express')
const mongoose = require('./db/mongoose')
const User = require('./models/user')
const task = require('./models/task')
const app = express()
const port = process.env.PORT //|| 3000
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const multer = require('multer')
//uploading files / images
// const upload =  multer({
//     dest : 'images'
// })
// app.post('/upload',upload.single('upload'), (req,res)=>{
//     res.send()
// })

// TWO MIDDLEWARE FUNCTIONS
// app.use((req,res,next)=>{
//     if(req.method === "GET"){
//         res.send('GET requests are disbaled')
//     }else {
//         next()
//     }
// })

// app.use((req,res,next)=>{
//     res.send(503).send("Unavialable")
// })

app.use(express.json({extended: false})) // to extract data from postman
// const router = new express.Router()
// router.get('/test',(req,res)=>{
//     res.send('NEW')
// })
app.use('/',userRouter)
app.use(taskRouter)
app.listen(port,()=>{
    console.log("server is up on port : "+port)
})
// const bcrypt = require('bcryptjs')

// const myFunction = async ()=>{
//     const password = '14752369'
//     const hashedPassword = await bcrypt.hash(password , 8)

//     console.log(password)
//     console.log(hashedPassword)

//     const isMatch = await bcrypt.compare('147852369', hashedPassword)
//     console.log(isMatch)
// }

// myFunction()



const jwt = require('jsonwebtoken')

const myFunction =async () =>{
    const token = jwt.sign({_id : 'avdhdhsjf'},'thisis',{expiresIn : '2 days'})
    console.log(token)

    const data = jwt.verify(token, 'thisis')
    console.log(data)
}
myFunction()

const Task = require('./models/task')
//const User = require('./models/user')
const main = async ()=>{

    // These below lines aim to fetch the details of the user who performed the particular task

    // const task = await Task.findById('5f776842ba5e3e2a8023af42')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)


    const user = await User.findById('5f7763aa56325a4d20a576d8')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}

main()