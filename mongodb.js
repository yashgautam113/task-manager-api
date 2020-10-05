// CRUD create read update delete

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID
//same above thing using destructuring
const { MongoClient, ObjectID} = require('mongodb')
const { Collection } = require('mongoose')
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager' // any random name

//  const id = new ObjectID()
// console.log(id.id.length)
// console.log(id.getTimestamp())
// console.log(id.toHexString().length)
MongoClient.connect(connectionURL,{useNewUrlParser: true, useUnifiedTopology: true},(error,client)=>{
    if(error){
        return console.log('Unable to connect to database!')
    }
    const db = client.db(databaseName)
  
    //INSERTION
  
    // db.collection('users').insertOne({
    //     _id: id,
    //     name: '__Yash',
    //     Age : 20
    // },(error,result)=>{
    //     if(error)
    //     return console.log('Unable to insert user')
    //     console.log(result.ops)
    // })
    // db.collection('users').insertOne({
    //     name: 'Yash11',
    //     Age : 20
    // }, (error,result)=>{
    //     if(error)
    //     return console.log('Unable to insert user')
    //     console.log(result.ops)
    //     console.log(result.insertedCount)
    // })
    // db.collection('users').insertMany([
    //     {
    //         name : 'xyz',
    //         Age : 69
    //     },
    //     {
    //         name : 'abc',
    //         Age: 69
    //     }
    // ], (error,result)=>{
    //     if(error)
    //     return console.log('Unaable')
    //     console.log(result.ops)
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description : 'Clean',
    //         completed : true
    //     },
    //     {
    //         description : 'Clean1',
    //         completed : true
    //     },
    //     {
    //         description : 'Clean1',
    //         completed : true
    //     }
    // ], (error,result)=>{
    //     if(error)
    //     return console.log('Unable')
    //     console.log(result.ops)
    // })



    // FINDING

    // db.collection('users').findOne({ _id : new ObjectID("5f6cdfefc931bd35cc791793")}, (error,user)=>{
    //     if(error){
    //         return console.log('Unable')
    //     }
    //     console.log(user)
    // })
    // db.collection('users').find({Age : 69}).toArray((error,users)=>{
    //     console.log(users)
    // })
    // db.collection('users').find({Age : 69}).count((error,count)=>{
    //     console.log(count)
    // }) 
    // db.collection('users').findOne({ _id : new ObjectID("5f6d888b433cd546b058330c")},(error,user)=>{
    //     if(error)
    //     return console.log('Unable')
    //     console.log(user)
    // })
    // db.collection('tasks').find({completed: false}).toArray((error,users)=>{
    //     if(error)
    //     return console.log('Unable')
    //     console.log(users)
    // })




    // UPDATION
//     const updatePromise = db.collection('users').updateOne({
//         _id : new ObjectID("5f6cdfefc931bd35cc791793")
//     }, {
//     // $set : {
//     //     name : 'YoYash'
//     // }
//     $inc : {
//         Age : 1
//     }
// })
//  updatePromise.then((result)=>{
//      console.log(result)
//  }).catch((error)=>{
//      console.log(error)
//  })
//  const updatePromise = db.collection('tasks').updateMany({
//     completed : false
// }, {
//  $set : {
//      completed : true
//  }
// $inc : {
//     Age : 1
// }
//  })
// updatePromise.then((result)=>{
//  console.log(result.modifiedCount)
// }).catch((error)=>{
//  console.log(error)
// })


// DELETION
 db.collection('users').deleteMany({Age : 69}).then((result)=>{
     console.log(result)
 }).catch((error)=>{
     console.log(error)
 })
})