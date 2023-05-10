const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./user.model");
const Item = require("./item.model");
var app = express();
var session = require("express-session");
var MongoStore = require("connect-mongo");

app.use(cors({ origin: ["http://localhost:4200"], credentials: true }));
app.use(bodyParser.json());

mongoDbUrl =
"mongodb+srv://fredprazeres10:Aguadestilada1@basededados.zyckr6w.mongodb.net/TrabalhoPSI?retryWrites=true&w=majority";

mongoose.connect(mongoDbUrl);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const store = MongoStore.create({
  mongoUrl: mongoDbUrl,
  collectionName: "sessions",
});

app.use(
  session({
    secret: "Aguadestilada123",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

const validatePayloadMiddleware = (req, res, next) => {
  if (req.body) {
    next();
  } else {
    res.status(403).send({
      errorMessage: "You need a payload",
    });
  }
};

app.get("/users", async (req, res) => {
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

app.post('/follow/:name', async (req, res) => {
  try {
    const targetUserName = req.params.name;
    const sessionUserName = req.body.name;

    const currentUser = await User.findOne({ name: sessionUserName });
    const targetUser = await User.findOne({ name: targetUserName });

    if (!targetUser) {
      return res.status(404).json('User not found');
    }

    targetUser.followerLists.push(currentUser.name);
    currentUser.followingLists.push(targetUser.name);

    await targetUser.save();
    await currentUser.save();

    req.session.user = currentUser;

    res.json('Followed successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/followers/:name', async (req, res) => {
  const user = await User.findOne({ name: req.params.name });
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  const followers = user.followerLists;
  return res.status(200).json({ followers: followers });
});
app.get('/following/:name', async (req, res) => {
  const user = await User.findOne({ name: req.params.name });
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  const following = user.followingLists;
  return res.status(200).json({ following: following });
});


app.post('/unfollow/:name', async (req, res) => {
  try {
    const targetUserName = req.params.name;
    const sessionUserName = req.body.name;

    const currentUser = await User.findOne({ name: sessionUserName });
    const targetUser = await User.findOne({ name: targetUserName });

    if (!targetUser) {
      return res.status(404).json('User not found');
    }

    targetUser.followerLists = targetUser.followerLists.filter(
      (follower) => follower !== currentUser.name
    );
    currentUser.followingLists = currentUser.followingLists.filter(
      (following) => following !== targetUser.name
    );

    await targetUser.save();
    await currentUser.save();

    req.session.user = currentUser;

    res.json('Unfollowed successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});





app.get("/item/:name", async (req, res) => {
  await Item.findOne({ name: req.params.name })
    .then((item) => {
      if (item) {
        res.json(item);
      } else {
        res.status(404).send("No item found with that name");
      }
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

app.delete("/user/wishlist/:name",async(req,res)=>{
  var existingItem;

  await Item.findOne({ name: req.params.name }).then((item) => {
    existingItem = item;
  });
  if (existingItem === null) {
    return res.status(400).json({ error: "Item doesnt exist" });
  }

  await User.findOne({ name: req.session.user.name })
    .then(async (user) => {
      user.wishlist.pop(existingItem.name);
      await user.save();
      req.session.user = user;
      res.json();
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

app.post("/items", async (req, res) => {
  const existingItem = await Item.findOne({ name: req.body.name });
  if (existingItem) {
    return res.status(400).json({ error: "Item already exists" });
  }

  const newItem = new Item({
    name: req.body.name,
    type: req.body.type,
    description: req.body.description,
    platform: req.body.platform,
    languages: req.body.languages,
    price: req.body.price,
  });

  await newItem
    .save()
    .then((item) => {
      res.json(item);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
});

app.get("/items", async (req, res) => {
  await Item.find({})
    .select("-_id -__v")
    .then((items) => {
      res.json(items);
    })
    .catch((err) => {
      console.log("err");
      res.status(500).json({ error: err });
    });
});

app.put("/user/library/:name", async (req, res) => {
  var existingItem;

  await Item.findOne({ name: req.body.name }).then((item) => {
    existingItem = item;
  });
  if (existingItem === null) {
    return res.status(400).json({ error: "Item doesnt exist" });
  }

  await User.findOne({ name: req.params.name })
    .then(async (user) => {
      user.library.push(existingItem.name);
      await user.save();
      req.session.user = user;
      res.json();
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

app.put("/user/wishlist/:name", async (req, res) => {
  var existingItem;

  await Item.findOne({ name: req.params.name }).then((item) => {
    existingItem = item;
  });

  if (existingItem === null) {
    return res.status(400).json({ error: "Item doesnt exist" });
  }

  await User.findOne({ name: req.session.user.name })
    .then(async (user) => {
      user.wishlist.push(existingItem.name);
      await user.save();
      req.session.user = user;
      res.json();
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

app.put("/user/cart/:name", async (req, res) => {
  var existingItem;

  await Item.findOne({ name: req.params.name }).then((item) => {
    existingItem = item;
  });
  if (existingItem === null) {
    return res.status(400).json({ error: "Item doesnt exist" });
  }

  await User.findOne({ name: req.session.user.name })
    .then(async (user) => {
      user.carrinho.push(existingItem.name);
      await user.save();
      req.session.user = user;
      res.json();
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

app.get("/user/:name", async (req, res) => {
  await User.findOne({ name: req.params.name })
    .select("-_id -__v -password")
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).send("No user found with that name");
      }
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

app.post("/users", async (req, res) => {
  const existingUser = await User.findOne({ name: req.body.name });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const newUser = new User({
    name: req.body.name,
    password: req.body.password,
  });

  await newUser
    .save()
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
});

app.post("/login", validatePayloadMiddleware, async (req, res) => {
  const { name, password } = req.body;
  await User.findOne({ name, password })
    .select("-_id -__v -password")
    .then((user) => {
      if (user) {
        req.session.user = user;
        res.send(req.session.user);
      } else {
        res
          .status(401)
          .send({ errorMessage: "Username ou password inválidos" });
      }
    })
    .catch((err) => {
      res.status(500).send(err.message);
    });
});

app.get("/login", async (req, res) => {
  try {
    if (req.session.user) {
      // If there is a user in the session, return it
      res.status(200).send(req.session.user);
    } else {
      // If there is no user in the session, return a 401 error
      res.status(401).send({ errorMessage: "User not logged in" });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send("Could not log out");
    } else {
      res.send({ message: "Logged out" });
    }
  });
});


app.put("/item/rating/:name",validatePayloadMiddleware, async (req, res) => {

  const { userName, rating, comment } = req.body;

  var existingItem;

  // find the item with the matching name in the database
  await Item.findOne({ name: req.params.name }).then((item) => {

  const userReviewed = item.ratings.find(rating => rating.name === req.body.name);

  if (userReviewed) {
    // User has already reviewed the item
    res.status(401).send({ errorMessage: "User already reviewed the item!" });
  }
    existingItem = item;
    item.ratings.push({
      name: req.body.name,
      rating: rating,
      comment: comment
    });

    const sum = item.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    const overallrating = sum / item.ratings.length;
    
    // Update the overallrating property of the item object
    item.overallRating = overallrating;

   item.save();
  });

  if (existingItem === null) {
    return res.status(400).json({ error: "Item doesnt exist" });
  }else{
    return res.json();
  }

});

app.listen(3058, () => console.log(`Express server running on port 3058`));