// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;

const {MongoClient,ObjectID} = require('mongodb');

const connectionUrl = "mongodb://127.0.0.1:27017"
const databaseName = "task-manager"

// const id = new ObjectID()
// console.log(id.toHexString())

MongoClient.connect(connectionUrl,{useNewUrlParser:true,useUnifiedTopology:true},(error,client)=>{
    if(error){
       return console.log("unable to connect database!");
    }

   const db = client.db(databaseName);

//    db.collection('user').insertOne({
//        name:"Varun",
//        age:25
//    },(err,result)=>{
//        if (err) {
//            return console.log("unable to input user")
//        }

//        console.log(result.ops);
//    })

// db.collection('user').insertMany([
//     {
//         name:"SHAN",
//         age:22
//     },
//     {
//         name:"RAM",
//         age:25
//     }
// ],(err,result)=>{
//     if (err) {
//         return console.log("Unable to input users");
//     }

//     console.log(result.ops);
// })

// db.collection('tasks').insertMany([
//     {
//         task:"Develop tasks manager app",
//         status:"Incomplete",
//         completed:false
//     },
//     {
//         task:"open a company",
//         status:"Incomplete",
//         completed:false
//     },
//     {
//         task:"Earn Money",
//         status:"In progress",
//         completed:false
//     }
// ],(err,result)=>{
//     if (err) {
//         return console.log("Unable to enter task");
//     }
//     console.log(result.ops);
// })

// db.collection('tasks').findOne({_id: new ObjectID("5d60d86d3e02c553086c7a58")},(err,result)=>{
//     if (err) {
//         return console.log("unable to fetch task!");
//     }
//     console.log(result);
// })

// db.collection('tasks').find({completed:false}).toArray((error,result)=>{
//     if (error) {
//         return console.log('Unable to fetch data!')
//     }
//     console.log(result)
// })

// db.collection('tasks').find({completed:null}).count((err,result)=>{
//     if (err) {
//         return console.log('Unable to fetch');
//     }
//     console.log(result);
// })

// update operation

// db.collection('user').updateOne({_id: new ObjectID("5d60cfb04a3e663944479eab")},
// {
//     $set:{
//         name:"Lakshman"
//     },
//     $inc:{
//         age:1
//     }
// }).then(result=>{
//     console.log(result)
// }).catch(err=>{
//     console.log(err)
// })

// db.collection('tasks').updateMany({completed:undefined},
//     {
//         $set:{
//             completed:false
//         }
//     }).then((result)=>{
//         console.log(result);
//     }).catch(err=>{
//         console.log(err);
//     })


// delete operation

db.collection('user').deleteMany({age:25})
.then(result=>{
    console.log(result.deletedCount);
}).catch(err=>{
    console.log(err)
})

db.collection('tasks').deleteOne({status:"In progress"})
.then(res=>{
    console.log(res);
}).catch(err=>{
    console.log(err);
})

})