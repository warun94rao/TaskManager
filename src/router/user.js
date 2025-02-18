const express = require("express")
const User = require('../models/users')
const router = express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail,sendClosingMail} = require('../email/account')

router.post('/users',async (req,res)=>{
    // console.log(req.body);
    // res.send("testing...")
    const user = new User(req.body);

    try {
        
       await user.save()
       sendWelcomeEmail(user.email,user.name)
       const token = await user.generateAuthToken()
       res.status(201).send({user,token})
    } catch (error) {
        res.status(400).send(error)
    }

    // user.save().then(()=>{
    //     res.status(201).send(user);
    // }).catch(err=>{
    //     res.status(400).send(err); 
    // })
})

router.post('/users/login', async (req,res)=>{
try {
    const user = await User.findByCredential(req.body.email,req.body.password)
    const token = await user.generateAuthToken()
    // res.send({user:user.getProfile(),token})
    res.send({user,token})
} catch (error) {
    res.status(400).send(error)
}
})

// multer to upload images
const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
            return cb(new Error("please upload images with (jpeg,jpg,png) format"))
        }
        cb(undefined,true)
    }
})
// save uploaded image to user accont
router.post('/users/me/avatar', auth ,upload.single('avatar'),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

// get users avatar
router.get('/users/:id/avatar',async (req,res)=>{
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send(error)
    }
})


// delete user avatar

router.delete('/users/me/avatar',auth,async(req,res)=>{
try {
    req.user.avatar = undefined
    await req.user.save()
    res.send(req.user)
} catch (error) {
    res.status(500).send(error)
}
})

// log-out 
router.post('/users/logout',auth,async(req,res)=>{
try {
    req.user.tokens = req.user.tokens.filter((token)=>{
        token.token !== req.token
    })
    await req.user.save()
    res.send()
} catch (error) {
    res.status(500).send()
}
})
// log-out all
router.post('/users/logout/all',auth,async (req,res)=>{
    try {
        req.user.tokens = []
       await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})
router.get('/users/me',auth,async (req,res)=>{

    res.send(req.user)

    // try {
    //    const users = await User.find({})
    //     res.send(users)
    // } catch (error) {
    //     res.status(500).send(error)
    // }

    // User.find({}).then(users=>{
    //     res.send(users)
    // }).catch(e=>{
    //     res.status(500).send(e);
    // })
})

// router.get('/user/:id',async(req,res)=>{
//     const _id = req.params.id;

//     try {
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (error) {
//         res.status(500).send(e);
//     }

//     // User.findById(_id).then(user=>{
//     //     if (!user) {
//     //         return res.status(404).send()
//     //     }
//     //     res.send(user)
//     // }).catch(e=>{
//     //     res.status(500).send(e);
//     // })
// })

router.patch('/users/me',auth,async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowableUpdates = ["name","age","password","email"]
    const isValidOperation = updates.every(update=>allowableUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(404).send({"error":"invalid operation"})
    }
    try {
     //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    //  const user = await User.findById(req.params.id)
    //  if (!user) {
    //      return res.status(404).send();
    //  }
    
     updates.forEach(update=>req.user[update]=req.body[update])
     await req.user.save()
     res.status(201).send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/me',auth, async (req,res)=>{
    try {
        // const user = await User.findByIdAndDelete(req.params.id)
        // if (!user) {
        //     return res.status(400).send()
        // }
        await req.user.remove()
        sendClosingMail(req.user.email,req.user.name)
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})



module.exports = router