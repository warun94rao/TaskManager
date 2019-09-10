const express = require('express')
const Tasks = require('../models/tasks')
const router = express.Router()
const auth = require('../middleware/auth')

router.post('/tasks',auth,async(req,res)=>{
   // const task = await new Tasks(req.body);
   const task = await new Tasks({
       ...req.body,
       owner:req.user._id
   });
    try {
        await task.save()
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(e);
    }
    // task.save().then(()=>{
    //     res.status(201).send(task);
    // }).catch(e=>{
    //     res.status(400).send(e);
    // })
})

// Get /tasks?completed=true
// Get /tasks?limit=10&skip=20
// Get /tasks?sortBy=createdAt:asc
router.get('/tasks',auth,async(req,res)=>{
    const match = {}
    const sort = {}
    
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortBy) {
        const part = req.query.sortBy.split(':')
        sort[part[0]]= part[1] === 'desc' ? -1 : 1
    }

    try {
        // one way
        // await req.user.populate('tasks').execPopulate()
        // alternate way
        // const tasks = await Tasks.find({owner:req.user._id})
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send(e);
    }
    // Tasks.find({}).then(tasks=>{
    //     res.send(tasks)
    // }).catch(e=>{
    //     res.status(500).send(e);
    // })
})

router.get('/task/:id',auth,async(req,res)=>{
    const _id = req.params.id;

    try {
        // const task = await Tasks.findById(_id)
        const task = await Tasks.findOne({_id,owner:req.user._id})
        if (!task) {
            return res.status(404).send();
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(e);
    }

    // Tasks.findById(_id).then(task=>{
    //     if (!task) {
    //         return res.status(404).send();
    //     }
    //     res.send(task)
    // }).catch(e=>{
    //     res.status(500).send(e);
    // })
})

router.patch('/tasks/:id',auth, async (req,res)=>{
   const updates = Object.keys(req.body)
    const allowableUpdates = ["description","completed"]
    const validUpdate = updates.every(update=>allowableUpdates.includes(update))

    if (!validUpdate) {
        return res.status(400).send({"error":"Invalid input/update"})
    }

    try {
      // const task = await Tasks.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
     // const task = await Tasks.findById(req.params.id)
     const task = await Tasks.findOne({_id:req.params.id,owner:req.user._id})
       if (!task) {
           return res.status(400).send()
       }
       updates.forEach(update=>task[update]=req.body[update])
       await task.save()
       res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }

})

router.delete('/tasks/:id',auth, async(req,res)=>{
    try {
        // const task = await Tasks.findByIdAndDelete(req.params.id)
        const task = await Tasks.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if (!task) {
            return res.status(400).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router