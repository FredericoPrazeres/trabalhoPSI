const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./user.model");
var app = express();
var session = require('express-session');
var MongoStore = require('connect-mongo');

app.use(cors({origin:["http://localhost:4200"],credentials:true}));
app.use(bodyParser.json());

mongoDbUrl = 'mongodb+srv://fredprazeres10:Aguadestilada1@basededados.zyckr6w.mongodb.net/TrabalhoPSI?retryWrites=true&w=majority';

mongoose.connect(mongoDbUrl);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');

});

const store = MongoStore.create({
    mongoUrl: mongoDbUrl,
    collectionName: 'sessions'
})

app.use(session({
    secret: 'Aguadestilada123',
    resave: false,
    saveUninitialized: false,
    store: store
}));

const validatePayloadMiddleware = (req,res,next) =>{
    if (req.body){
        next();
    }else{
        res.status(403).send({
            errorMessage:'You need a payload'
        });
    }
};




app.get('/users', async(req, res) => {

    await User.find({})
        .select("-_id -__v")
        .then((users) => {
            res.json(users);
        })
        .catch((err) => {
            console.log("err");
            res.status(500).json({ error: err });
        });
});

app.get('/user/:name', async(req, res) => {
    await User.findOne({ name: req.params.name }).select('-_id -__v -password').then(user => {
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('No user found with that name');
        }
    }).catch(err => {
        res.status(500).send(err.message);
    });
});

app.post('/users', async(req, res) => {
    const existingUser = await User.findOne({ name: req.body.name });
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = new User({
        name: req.body.name,
        password: req.body.password,
    });

    await newUser.save()
        .then((user) => {
            res.json(user);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: error });
        });
});


app.post('/login',validatePayloadMiddleware, async(req, res) => {
    const { name, password } = req.body;
    await User.findOne({ name, password }).select('-_id -__v -password')
        .then(user => {
            if (user) {
                const userWithoutPassword={user};
                delete userWithoutPassword.password;
                req.session.user=userWithoutPassword;
                res.send(userWithoutPassword);
            } else {
                res.status(401).send({ errorMessage: 'Username ou password inválidos' });
            }
        })
        .catch(err => {
            res.status(500).send(err.message);
        });
});

app.get('/login', async (req, res) => {
    try {
      if (req.session.user) {
        // If there is a user in the session, return it
        res.status(200).send(req.session.user);
      } else {
        // If there is no user in the session, return a 401 error
        res.status(401).send({ errorMessage: 'User not logged in' });
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  app.get('/logout', async (req, res) => {
    req.session.destroy((err) =>{
        if(err){
            res.status(500).send('Could not log out');
        }else{
            res.send({message:'Logged out'});
        }
    });
  });




app.listen(3000, () => console.log(`Express server running on port 3000`));