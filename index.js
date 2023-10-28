const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');

require('dotenv').config();
const port = process.env.PORT || 5000;


//? middleware
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


//? our own middleware
const verifyToken = async (req, res, next) => {
    const token = req.cookies?.token;
    if(!token) {
        return res.status(401).send({message : 'Not Authorized'})
    }

    //? Now verify the token.
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        //? if error the middleware will send respond to the api that has been called and CRUD method will stop at the middleware. Won't execute the next code.
        if(err) {
            console.log(err);
            return res.status(401).send({message: 'not authorized'})
        }

        //? if token is valid then it will be decoded. and it will call the next(). And on the api we are using the middleware will execute the process after the middleware.
        
        //? set the decoded to req.user so that the CRUD api can access the valid token user information.
        req.user = decoded; 
        next();
    })
}


app.listen(port, () => {
    console.log(`Port ${port} is running fine.`);
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//? Creating environment setup for userName and Password.
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster2.edqru7i.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  async function run () {

    try {

        const database = client.db('carDoctor');
        const serviceCollection = database.collection('services');
        const bookingCollection = database.collection('bookings');

        //* Auth api
        app.post('/jwt', async(req, res) => {
            const user = req.body;
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const token = jwt.sign(user,secret,{expiresIn: '1h'});
            res
            .cookie('token', token, {
                httpOnly: true,
                secure: false,
                // sameSite: 'none'
            })
            .send({success : true});

        })

        //* Services api
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/service/:id' , async (req, res) => {
            const id = req.params.id;
            const filter = { _id : new ObjectId(id)};
            const result = await serviceCollection.findOne(filter);
            res.send(result);
        })


        //? Give the verify token to verify the user.

        app.get('/bookings', verifyToken, async(req, res) => {
            
            // console.log('token', req.cookies.token);
            //? this  is from verifyToken (req.user)
            console.log('valid token user', req.user);
            
            //? check if the token user email matches to the query email. If not return the process with 401(UnAuthorized) status and a message.
            if(req.query.email !== req.user.email) {
                return res.status(401).send({message: 'not authorized'})
            }

            //? There is also a params called query we can give any value when we req the fetch method from client side.

            //* 01. Just like this (url/url?theQueryGoesHere=value&AnotherOne=AnotherValue).
            //* 02. And on the other side I mean here on serverSide we
            //* get this value by using (req.params.theQuery)

            //? So it we req with a query and it contains an email it will filter the result as email or will return all the value.

            const query = {};
            if(req.query?.email) {
                 const query = {email : req.query.email};
            }

            const cursor = bookingCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/checkout', async (req, res) => {
            const order = req.body;
            const result = await bookingCollection.insertOne(order);
            res.send(result);
        })

        app.patch('/confirm/:id', async (req, res) => {
            const id = req.params.id;
            const statusBody = req.body;
            const filter = { _id : new ObjectId(id)};
            const updateDoc = {
                $set: {
                    status : statusBody.status
                }
            }
            const result = await bookingCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id : new ObjectId(id)};
            const result = await bookingCollection.deleteOne(filter);
            res.send(result);
        })

        await client.db("admin").command({ ping : 1 })
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }finally {

    }

  }
  run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Port is running on 5000');
})