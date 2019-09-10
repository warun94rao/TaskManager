const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/tasks')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if (!validator.isEmail(value)) {
                throw new Error('Provide proper email')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if (value.toLowerCase().includes("password")) {
                throw new Error("Your password to be unique and shouldn't be password")
            }
        }
    },
    age:{
        type:Number,
        validate(value){
            if (value<0) {
                throw new Error('Age must be positive number!')
            }
        },
        default:0
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref:'Tasks',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON = function(){
    const user = this

    const userObject = user.toObject()
    

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
   
    return userObject
}

userSchema.methods.generateAuthToken = async function (){
const user = this

console.log(process.env.JWT_SECRET)
const token = await jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)

user.tokens = user.tokens.concat({token})
await user.save()

return token
}

userSchema.statics.findByCredential = async (email,password)=>{
    const user = await User.findOne({email})

    if (!user) {
        throw new Error('Unable to login!')
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}
// hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this
    
   if (user.isModified('password')) {
       user.password = await bcrypt.hash(user.password,8)
   }

    next()
})

// to delete tasks when user is deleted
userSchema.pre('remove',async function(next){
    const user = this

    await Task.deleteMany({owner:user._id})

    next()
})

const User = mongoose.model('User', userSchema)



module.exports = User;