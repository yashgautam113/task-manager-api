const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
 },
email : {
    type : String,
    required : true,
    unique : true,
    trim : true,
    lowercase : true,
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error("INVALID EMAIL")
        }
    }
},
password : { 
        type : String,
        required : true,
        validate(value){
            if(value.length < 7)
            throw new Error("Too small")
        },
        trim : true,
        validate(value){
            if(value.includes('password'))
            throw new Error("Invalid Choice")
        }

},
Age : {
       type : Number,
       default : 0,
       required : true,
       validate(value){  // making restriction on value
           if(value<0){
               throw new Error('Age must be a positive number')
           }
       }
},
tokens: [{
    token: {
        type : String,
        required : true
    }
}]
// for timestamps
}, {
    timestamps : true
})

// userSchema.methods./*getPublicProfile*/toJSON = function (){
//     const user = this
//     const userObject = user.toObject()
    
//     delete userObject.password
//     delete userObject.tokens
//     return userObject
// }


// to avoid token coming out with output object
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

// virtual object (not stored in the database) to create link between User and Task
// so that we can fetch tasks data by User id
userSchema.virtual('tasks',{
    ref: 'Task',
    localField : '_id', //owner object id
    foreignField : 'owner'
})

//methods fn instance methods
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id : user._id.toString() },process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    console.log(token)
    await user.save()
    return token
}


// LOGGING IN ROUTE
//staic functions are available on models
userSchema.statics.findByCredentials = async(email,password) =>{
    const user = await User.findOne({email})
    //this is a middleware function
    if(!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error('Unable to Login')
    }

    return user
}
// Hash the plain text password before saving
userSchema.pre('save',async function (next){
    const user = this
// a middleware
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password,8)
    }
    console.log('Just before saving')
    next()
})


// Delete user tasks when user is removed
userSchema.pre('remove',async function(next) {
    const user = this
   
    await Task.deleteMany({owner : user._id})


    next()
})
const User = mongoose.model('User', userSchema )

module.exports = User