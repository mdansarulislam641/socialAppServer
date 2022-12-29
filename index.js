const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
// middle ware

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000 ;



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster1.cyhfubw.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


app.get('/', (req, res)=>{
    res.send({
        success:true,
        message:'it working'
    })
})

// database collections
const usersCollections = client.db('socialMediaApp').collection('usersInfo')
const addPostCollection = client.db('socialMediaApp').collection('addPostInfo');

function run(){
    try{
        client.connect();  
    }
    catch(e){
        console.log(e.message)
    }

}


        // user information save in database from register user
        try{
            app.post('/users',async(req, res)=>{
                const information = req.body ;
                const user = await usersCollections.insertOne(information);
                res.send(user)
            })
        }
        catch(e){
            console.log(e.message)
        }

        //  add post information store database 
        app.post('/postInformation', async(req,res)=>{
            try{
                const information = req.body ;
                const result = await addPostCollection.insertOne(information);
                res.send(result);
            }
            catch(e){
                console.log(e.message)
            }
        })

        // get all added post for showing in media route
        app.get('/postInformation', async(req,res)=>{
            try{
                const result = await addPostCollection.find({}).toArray();
                res.send(result);
            }
            catch(e){
                console.log(e.message);
            }
        })

        // get post details by id for showing post details 
        app.get('/postInformation/:id',async(req,res)=>{
         try{
            const result = await addPostCollection.findOne({_id:ObjectId(req.params.id)});
            res.send(result)
         }
         catch(e){
            console.log(e.message)
         }
        })


run()
app.listen(port, ()=>{
    console.log(`server running on port ${port}`)
})
