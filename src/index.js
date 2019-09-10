const express = require("express")
require("./db/mongoose")

const User = require("./models/users")
const Tasks = require("./models/tasks")
const userRoute = require('./router/user')
const taskRoute = require('./router/task')
const multer = require('multer')

const app = express()
// env-cmd is used to get port 3000 details from config folder
const port = process.env.PORT

// app.use((req,res,next)=>{
//     if (req.method === "GET") {
//         res.send("Get Request is blocked");
//     }else{
//         next()
//     }
// })

// challenge trial
// app.use((req,res,next)=>{
//     res.status(504).send("Server is under Maintainance. Try again after some time!")
// })

// multer trial
const upload = multer({
    dest:'images',
    limits:{
        fileSize:1000000,
    },
    fileFilter(req,file,cb){
        // one way to do it
        // if (!file.originalname.endsWith('.pdf')) {
        //     return cb(new Error('Please upload a pdf'))
        // }
        // with regular expressions for conditioning
        if (!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error('Please upload word document'))
        }
        cb(undefined,true)
    }

})

app.post('/upload',upload.single('upload'),(req,res)=>{
res.send()
})

app.use(express.json());
app.use(userRoute);
app.use(taskRoute)

// const router = express.Router()
// router.get('/test',(req,res)=>{
//     res.send('Hello from router')
// })
// app.use(router)


// all routes are shifted to router/ser.js and changed from app.post/app.get to router.post/get
// app.post('/users',async (req,res)=>{
//     // console.log(req.body);
//     // res.send("testing...")
//     const user = new User(req.body);

//     try {
//        await user.save()
//        res.status(201).send(user)
//     } catch (error) {
//         res.status(400).send(error)
//     }

//     // user.save().then(()=>{
//     //     res.status(201).send(user);
//     // }).catch(err=>{
//     //     res.status(400).send(err); 
//     // })
// })

// same as the user task also moved to the roter/task
// app.post('/tasks',async(req,res)=>{
//     const task = await new Tasks(req.body);
//     try {
//         await task.save()
//         res.status(201).send(task);
//     } catch (error) {
//         res.status(400).send(e);
//     }
//     // task.save().then(()=>{
//     //     res.status(201).send(task);
//     // }).catch(e=>{
//     //     res.status(400).send(e);
//     // })
// })


app.listen(port, ()=>{
    console.log(`Server is running in port ${port}`)
})



// const main = async ()=>{
//     // const task = await Tasks.findById('5d734e4e6d56dd3fdce4acec')
//     // await task.populate('owner').execPopulate()
//     // console.log(task)

//     // const user = await User.findById('5d734e246d56dd3fdce4acea')
//     // await user.populate('tasks').execPopulate()
//     // console.log(user.tasks)
// }

// main()


//command to start database
// E:\database/mongodb/bin/mongod --dbpath=E:\database/mongodb-data
// npm run dev

































