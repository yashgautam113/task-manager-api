const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middlewares/auth')
const { ObjectID } = require('mongodb')

router.post('/tasks',auth,async (req,res)=>{
  //  const task = new Task(req.body)
  const task = new Task({
      ...req.body,//copyall properties
         owner : req.user._id
  })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }

    // tasks.save().then(()=>{
    //     res.status(201).send(tasks)
    // }).catch((error)=>{
    //     res.status(400).send(error)
      //  res.send(e)

})

router.get('/tasks',auth,async (req,res)=>{
  // to add query to access data using ?completed = true
    const match = {}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'

    }
    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = part[1] === 'desc' ? -1 : 1
    }

   try{
   // const tasks =await Task.find({ owner: req.user._id})
    // second approach
     await req.user.populate({
         path: 'tasks',
         match, // for ?completed true/false property filter
         // pagination /tasks?limit=10&skip=20 means 10 results on 3rd page
         options : {
             limit : parseInt(req.query.limit), // to create dynamicity in pagination
         // and parse int convert url string into no. and ignore if it is not possible
            skip : parseInt(req.query.skip),
            // sorting
            sort:{
              //  createdAt: 1 // 1 for ascending and -1 for descending
              completed : 1   // 1 completd task -1 incompleted task
            }
        }
     }).execPopulate()
    res.send(req.user.tasks)
   }catch(e){
    res.status(500).send()
   }
})

router.get('/tasks/:id',auth, async(req,res)=>{
    const _id = req.params.id
    try{
       // const task = await Task.findById(_id)
       //find task by its id and owner id
        const task = await Task.findOne({ _id, owner: req.user._id})
        if(!task)
        return res.status(404).send()

        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

router.patch('/tasks/:id',auth,async(req,res)=>{
    //console.log('parameter',req.user)
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid Operation'})
    }
    try{
        const task = await Task.findOne({ _id: req.params.id,owner: req.user._id})
        //const task = await Task.findById(req.params.id)
        if(!task)
        return res.status(404).send()
      updates.forEach((update)=>{
          task[update] = req.body[update]
      })
            await task.save()

           

            res.send(task)
        }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id',auth,async (req,res)=>{
    try{
        const task = await Task.findByIdAndDelete({_id: req.params.id,owner : req.user.id})
        if(!task){
            res.status(404).send()
        }
    }catch(e){
        res.status(500).send()
    }
})

module.exports =router