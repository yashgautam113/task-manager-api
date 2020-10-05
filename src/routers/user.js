const express = require('express')
const User = require('../models/user')
const auth = require('../middlewares/auth')
const router = new express.Router()

// ES6 Destructuring to just include the welcome function
const {sendWelcomeEmail, delemail } = require('../emails/account')

// router.post('/users',async (req,res)=>{
//     // console.log(req.body) // fetch out Post data from postman

//     // res.send('testing')
//     console.log(req.body)
    

//     try{
//         const user = new User(req.body)
//         const token = await generateAuthToken()
//         await user.save()
        
//         res.send({user,token})
//     }catch(e){
//         res.status(400).send(e)
//     }


//     // user.save().then(()=>{
//     //     res.status(201).send(user)
//     // }).catch((error)=>{
//     //     res.status(400).send(error)
//     //   //  res.send(e)
//     // })

// })
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        // sending Welcome email
        sendWelcomeEmail(user.email, user.name)

        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})


// for logging in

router.post('/users/login', async(req,res) => {
    try{
        // Verifying Username and password
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user/* : user.getPublicProfile()*/,token})
    }catch(e){
        res.status(400).send()
    }
})

// router.post('/users/logout',auth , async(req,res) =>{
//     try{
//         req.user.tokens = req.user.tokens.filter((token)=>{
//             return token.token !== req.token
//         })
//         await req.user.save()

//         res.send()
//     }catch(e){
//         res.send(500).send()
//     }
// })

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


// router.post('/users/logoutAll',auth,async(req,res)=>{
//     try{
//         req.user.tokens = []
//         await req.user.save()
//         res.send()
//     }catch(e){
//         res.status(500).send()
//     }
// })
//GET handler to retrieve data from database
router.get('/users',auth,async (req,res) => {
    // User.find({}).then((users)=>{
    //   res.send(users)
    // }).catch((error)=>{
    //     res.status(500).send()
    // })
    try{
    const users = await User.find({})
    res.send(users)
    }catch(e) {
        res.status(500).send()
    }
})

router.get('/users/me' ,auth , async(req,res)=>{
    res.send(req.user)
})


router.get('/users/:id',(req,res)=>{
    const _id = req.params.id
    User.findById(_id).then((user)=>{
         if(!user)
         return res.status(404).send()  
         res.send(user)  
    }).catch((e)=>{
        res.status(500).send()
    })
})
// UPDATION OF DATA
router.patch('/users/me',auth,async (req,res)=>{
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name','email','password','Age']
        const isValidOperation = updates.every((update)=>{
            return allowedUpdates.includes(update)
        })
        if(!isValidOperation){
            return res.status(400).send({error: 'Invalid'})
        }
    try{
        //const user = await User.findById(req.params.id)

        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })        
        await req.user.save()
        // const user = await User.findById(req.params.id)
        
        // updates.forEach((update) => {
        //     user[update] = req.body[update]
        // })
        // await user.save()

       // const user = await User.findByIdAndUpdate(req.params.id,req.body, {new : true, runValidators : true})

        // if(!user)
        // return res.status(404).send()
        res.send(req.user)
    }catch(e){
         res.status(404).send()
    }
})

router.delete('/users/me',auth,async (req,res)=>{
    try{
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user)
        // return res.status(404)
        
        await req.user.remove()
        delemail(req.user.email,req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router