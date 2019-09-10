const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
})





// const me = new User({
//     name:"      Varun",
//     email:"varun@va.com",
//     password:"samsung"
// })

// me.save()
// .then((res)=>{console.log(me)})
// .catch(error=> {console.log(error)})

// const task = new Tasks({
//     description: "Build a company",
   
// })

// task.save()
// .then(res=>{
//     console.log(res)
// })
// .catch(err=>{
//     console.log("error",err)
// })

