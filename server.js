// Required modules
const { MongoClient } = require('mongodb');
const path = require('path');
require("dotenv").config({ path: path.join(process.env.HOME, '.cs304env') });
const multer = require('multer');
const express = require('express');
const morgan = require('morgan');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const { findUser, addUser, verifyUser } = require('./db_users'); // Assuming these functions are defined in db_users.js
const { Connection } = require('./connection');
const cs304 = require('./cs304');

// Create and configure the app
const app = express();

// Middleware for session management
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000}
}));

// make username available in templates
app.use((req, res, next) => {
  res.locals.username = req.session.username || null;
  next();
});

app.use(flash()); // Flash messages middleware
app.use(morgan('tiny')); // Log every request

// Middleware to parse request data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (e.g., CSS, JS) from the 'public' directory
app.use(serveStatic('public'));
//to handle profile page
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
//end of handling profile page
// NF edits to have dynamic users collection
// Connect to MongoDB and get the collection
let cachedDb = null;
const getUserCollection = async () => {
  if (cachedDb) return cachedDb.collection('users');  // Return cached db if it's already connected
  // const client = await MongoClient.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  const client = await MongoClient.connect(mongoUri);
  const db = client.db('aura');  // Your database name
  cachedDb = db;  // Cache the connection for future use
  return db.collection('users');
};
// end of NF edits

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// ================================================================
// Custom routes here

const DB = process.env.USER;
const mongoUri = cs304.getMongoUri();
const ACCESSORY_DB = 'accessoryCollection';
const crystals = 'crystals';
const USERS_COLLECTION = 'users';


//==================================================================
// User log in and log out
// login page display 

// Ensure flash messages are available in views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Route to render the login page (GET)
// Route to handle login form submission (POST)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Verify user credentials
  const success = await verifyUser(username, password);
  if (!success) {
    req.flash("error", "Invalid username or password.");
    return res.redirect("/login");
  }

  // If login is successful, store the username in the session
  req.session.username = username;
  req.flash("info", "Successfully logged in.");
  res.redirect("/profile"); // Redirect to profile page after successful login
});

// Route to render the signup page (GET)
app.get("/signup", (req, res) => {
  res.render("login", {
    formType: 'signup', // Set formType to 'signup'
    messages: req.flash() // To display any flash messages
  });
});

app.get("/login", (req, res) => {
  const formType = req.query.form || 'login'; // Use the query parameter
  res.render("login", {
    username: req.session.username || null,
    formType: formType,  // Pass the correct formType
    messages: req.flash()
  });
});

// Route to handle signup form submission (POST)
app.post("/signup", async (req, res) => {
  const { username, password, dob } = req.body;

  // Check if the username already exists
  const existing = await findUser(username);
  if (existing) {
    req.flash("error", "Username already exists.");
    return res.redirect("/signup");
  }

  // Add new user to the database
  await addUser(username, password, dob);

  // Store the username in session
  req.session.username = username;
  req.flash("info", "Successfully signed up.");
  res.redirect("/profile"); // Redirect to profile page after successful signup
});

// Route to handle logout (GET)
app.get("/logout", (req, res) => {
  // Destroy the session (log the user out)
  req.session.destroy(err => {
    res.redirect("/"); // Redirect to home page after logging out
  });
});

// Middleware to protect routes that require login
function requiresLogin(req, res, next) {
  if (!req.session.username) {
    req.flash("error", "Please log in first.");
    return res.redirect("/login"); // Redirect to login page if not logged in
  }
  next();
}
//Nf edited this profile page and upload
// Set up multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, req.session.username + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Route to handle profile photo upload
app.post('/profile/upload', requiresLogin, upload.single('profilePhoto'), async (req, res) => {
  const imagePath = `/uploads/${req.file.filename}`;
  const users = await getUserCollection();
  await users.updateOne(
    { username: req.session.username },
    { $set: { profileImage: imagePath } }
  );
  res.redirect('/profile');
});

// Route to display the profile page (only accessible if logged in)
app.get("/profile", requiresLogin, async (req, res) => {
  const userDoc = await findUser(req.session.username);

  if (!userDoc) {
    req.flash("error", "User not found.");
    return res.redirect("/login");
  }

  res.render("profile", {
    name: userDoc.username,
    birthday: userDoc.dob,
    profileImage: userDoc.profileImage || null // avoid undefined
  });
});
// end of edits


//==================================================================
//functions
async function keywordSearch(db, keyword, type, sort) {
  const key = new RegExp(keyword, "i");
  const typeRegex = new RegExp(type, "i");

  // Build the $or keyword search condition
  const query = {
    $or:[
      {type: { $regex: key}},
      {Material: { $regex: key}},
      {usage: { $regex: key}},
      {color: { $regex: key}},
      {associated_zodiac_signs: { $regex: key }}
    ]
  };

    // Set sort options
    let sortOption = {item_id: 1}; // default sort
    if (sort === 'priceLowHigh') {
      sortOption = {price: 1};
    } else if (sort === 'priceHighLow') {
      sortOption = {price: -1};
    }

  // Perform everything in one MongoDB call
  const matched = await db.collection("crystals")
    .find(query)
    .sort(sortOption)
    .toArray();

  //filter the array to find items that match the specified type
  const filtered = matched.filter((item) => {
    return new RegExp(type, 'i').test(item.type);
  })

  //return the final array
  return filtered;
}

function zodiacSign(user){
  const bday = user.dob;
  let month = bday.getMonth();
  let date = bday.getDate();
  if (month == 0){
      if (date < 20){
          return 'capricorn';
      }
      else{
          return 'aquarius';
      }
  }
  else if (month == 1){
      if (date < 19){
          return 'aquarius';
      }
      else{
          return 'pisces';
      }
  }
  else if (month == 2){
      if (date < 20){
          return 'pisces';
      }
      else{
          return 'aries';
      }
  }
  else if (month == 3){
      if (date < 20){
          return 'aries';
      }
      else{
          return 'taurus';
      }
  }
  else if (month == 4){
      if (date < 21){
          return 'taurus';
      }
      else{
          return 'gemini';
      }
  }

  else if (month == 5){
      if (date < 21){
          return 'gemini';
      }
      else{
          return 'cancer';
      }
  }

  else if (month == 6){
      if (date < 23){
          return 'cancer';
      }
      else{
          return 'leo';
      }
  }

  else if (month == 7){
      if (date < 23){
          return 'leo';
      }
      else{
          return 'virgo';
      }
  }

  else if (month == 8){
      if (date < 23){
          return 'virgo';
      }
      else{
          return 'libra';
      }
  }

  else if (month == 9){
      if (date < 23){
          return 'libra';
      }
      else{
          return 'scorpio';
      }
  }

  else if (month == 10){
      if (date < 22){
          return 'scorpio';
      }
      else{
          return 'sagittarius';
      }
  }

  else if (month == 11){
      if (date < 22){
          return 'sagittarius';
      }
      else{
          return 'capricorn';
      }
  }
}


//============================================================

// Home page: display jewelry collection
app.get('/', async (req, res) => {
    let username = req.session.username || null;
    let visits = req.session.visits || 0;
    visits++;
    req.session.visits = visits;

    // Fetch a sample of jewelry items from the database
    const db = await Connection.open(mongoUri, "aura");
    let items = await db.collection(ACCESSORY_DB).find({}).limit(10).toArray();

    return res.render('index.ejs', {username, visits, items});
});


// Displays crystals
app.get('/crystals', async (req, res) => {
    const keyword = req.query.keyword || '';
    const type = req.query.type || '';
    const sort = req.query.sort || '';
    const db = await Connection.open(mongoUri, "aura");
    let items = await db.collection('crystals').find({}).toArray();
    // const items = await keywordSearch(db, keyword, type, sort);
    console.log(items.length);

    // Ensure session cart exists
    if (!req.session.cart) {
        req.session.cart = [];
    }

    const cartCount = req.session.cart.length;

    // Render the crystals.ejs template with the items array
    const username = req.session.username || null;
    return res.render('crystals.ejs', {items, keyword, cartCount, username, type, sort});

});  


app.post('/cart/add/:id', (req, res) => {
    const crystalId = parseInt(req.params.id);
    if (!req.session.cart) req.session.cart = [];

    const existing = req.session.cart.find(item => item.item_id === crystalId);
    if (existing) {
        existing.qty += 1;
    } else {
        req.session.cart.push({ item_id: crystalId, qty: 1 });
    }

    const cartCount = req.session.cart.reduce((sum, item) => sum + item.qty, 0);
    res.json({ cartCount });
});

app.post('/cart/remove/:id', (req, res) => {
    const idToRemove = parseInt(req.params.id);
    const cart = req.session.cart || [];

    const index = cart.findIndex(item => item.item_id === idToRemove);
    if (index !== -1) {
        cart[index].qty -= 1;
        if (cart[index].qty <= 0) {
            cart.splice(index, 1); // remove completely
        }
    }

    req.session.cart = cart;

    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
    res.json({ cartCount }); // respond with updated count
});

app.get('/cart', async (req, res) => {
    const db = await Connection.open(mongoUri, "aura");
    const cart = req.session.cart || [];

    const ids = cart.map(item => item.item_id);
    const itemsFromDB = await db.collection('crystals').find({ item_id: { $in: ids } }).toArray();

    const items = itemsFromDB.map(dbItem => {
        const match = cart.find(c => c.item_id === dbItem.item_id);
        return {
            ...dbItem,
            qty: match ? match.qty : 1
        };
    });

    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    res.render('checkout.ejs', { items, total });
});


app.post('/cart/place-order', async (req, res) => {
    const db = await Connection.open(mongoUri, "aura");

    // Get cart item IDs
    const cart = req.session.cart || [];
    // const cartIds = cart.map(id => parseInt(id));
    const cartIds = cart.map(item => item.item_id);

    // Fetch items in the cart
    const items = await db.collection('crystals').find({ item_id: { $in: cartIds } }).toArray();

    if (items.length === 0) {
        req.flash('error', 'Your cart is empty. Please add items before placing an order.');
        return res.redirect('/cart');
    }

    const total = items.reduce((sum, item) => sum + item.price, 0);

    // Simulate storing an order (optional: store in DB)
    const dbOrders = db.collection('orders');
    await dbOrders.insertOne({
        items,
        total,
        user: req.session.uid || "guest",
        placedAt: new Date()
    });

    // Clear the cart
    req.session.cart = [];

    res.render('place_order.ejs', { items, total });
});

//search sort filter
app.get('/crystals/find', async (req, res) => {
  const keyword = req.query.keyword || '';
  const type = req.query.type || '';
  const sort = req.query.sort || '';
  const db = await Connection.open(mongoUri, "aura");
  const items = await keywordSearch(db, keyword, type, sort)
  console.log(`Matched items: ${items.length}`);
  // Ensure session cart exists
  if (!req.session.cart) {
    req.session.cart = [];
  }

  const cartCount = req.session.cart.length;
  res.render('crystals.ejs', {items, keyword, type, sort, cartCount});
}); 

app.get('/zodiac', async (req, res) => {
const uid = req.session.uid;
const db = await Connection.open(mongoUri, "aura");
// Get user
const user = await db.collection("users").findOne({_id: uid});
if (!user || !user.dob) {
  return res.status(400).send("User or birth date not found.");
}
const zodiac = zodiacSign(user)
// Find products matched to zodiac
const recommendedItems = await db
  .collection("crystals")
  .find({associated_zodiac_signs: {$regex: new RegExp(zodiac, 'i')}})
  .toArray();

res.render("zodiac.ejs", {user, zodiac, recommendedItems});
});





// ================================================================
// postlude     

const serverPort = cs304.getPort(8080);
app.listen(serverPort, function() {
    console.log(`open http://localhost:${serverPort}`);
});