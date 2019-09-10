require('../src/db/mongoose')

const Task = require('../src/models/tasks')


// Task.findByIdAndRemove("5d63b6e1b2a99f530001b471").then(res=>{
//     console.log(res)
//     return Task.countDocuments({completed:false})
// }).then(count=>{
//     console.log('count',count);
// }).catch(e=>{
//     console.log(e)
// })

const deleteTaskandCount = async(id,completed)=>{
    await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed})
    return count
}

deleteTaskandCount("5d63c72924709857bc8272cf",false).then(count=>{
    console.log(count)
}).catch(e=>{
    console.log("e",e)
})
