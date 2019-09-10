require('../src/db/mongoose')

const User = require('../src/models/users')


// User.findByIdAndUpdate("5d63c5a4b0899a5598d49334",{age:25}).then(user=>{
//     console.log(user)
//     return User.countDocuments({age:0})
// }).then(count=>{
//     console.log('count',count);
// }).catch(e=>{
//     console.log(e)
// })

const updateUserAgeCount = async(id,age)=>{
    const user = await User.findByIdAndUpdate(id,{age})
    const count = await User.countDocuments({age})
    return count
}

updateUserAgeCount("5d63c5a4b0899a5598d49334",2).then(count=>{
    console.log(count)
}).catch(e=>{
    console.log("e",e)
})