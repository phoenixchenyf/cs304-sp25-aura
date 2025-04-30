// standard modules, loaded from node_modules
const path = require('path');
require("dotenv").config({ path: path.join(process.env.HOME, '.cs304env')});
const express = require('express');
const morgan = require('morgan');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const flash = require('express-flash');
const multer = require('multer');

// our modules loaded from cwd
const { Connection } = require('./connection');
const cs304 = require('./cs304');
const { keyword } = require('color-convert');
const { keyword } = require('color-convert');

// Create and configure the app
const app = express();

// Morgan reports the final status code of a request's response
app.use(morgan('tiny'));

app.use(cs304.logStartRequest);

// This handles POST data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cs304.logRequestData);  // tell the user about any request data
app.use(flash());

app.use(serveStatic('public'));
app.set('view engine', 'ejs');

const mongoUri = cs304.getMongoUri();

// Session setup
app.use(cookieSession({
    name: 'session',
    keys: ['horsebattery'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// ================================================================
// Custom routes here

const DB = process.env.USER;
const ACCESSORY_DB = 'accessoryCollection';
const crystals = 'crystals';

//==================================================================
//functions
async function keywordSearch(db, keyword) {
    let key = new RegExp(keyword, "i");
    let matched = await db
    .collection("crystals")
    .find({
      $or: [
        { type: { $regex: key } },
        { Material: { $regex: key } },
        { usage: { $regex: key } },
        { color: { $regex: key } },
        {associated_zodiac_signs:{$regex: key}}
      ]
    })
    .sort({ item_id: 1 }) 
    .toArray();
  
  return matched;
}
//============================================================

// Home page: display jewelry collection
app.get('/', async (req, res) => {
    let uid = req.session.uid || 'unknown';
    let visits = req.session.visits || 0;
    visits++;
    req.session.visits = visits;

    // Fetch a sample of jewelry items from the database
    const db = await Connection.open(mongoUri, "aura");
    let items = await db.collection(ACCESSORY_DB).find({}).limit(10).toArray();

    return res.render('index.ejs', {uid, visits, items});
});

var searchForm = {
  keyword : "green"
};

// Displays crystals
app.get('/crystals', async (req, res) => {
    const keyword = ""; 
    const db = await Connection.open(mongoUri, "aura");
    let items = await db.collection('crystals').find({}).toArray();
    console.log(items.length);

    // Ensure session cart exists
    if (!req.session.cart) {
        req.session.cart = [];
    }

    const cartCount = req.session.cart.length;

    // Render the crystals.ejs template with the items array

    return res.render('crystals.ejs', {items, keyword});
});  


//keyword search
app.get('/crystals/search', async (req, res) => {
    const keyword = searchForm.keyword;
    const db = await Connection.open(mongoUri, "aura");
    const items = await keywordSearch(db, keyword);
    console.log(`Matched items: ${items.length}`);

    return res.render('crystals.ejs', {items, keyword});
});  

// app.post('/cart/add/:id', async (req, res) => {
//     const crystalId = req.params.id;
//     if (!req.session.cart) req.session.cart = [];

//     req.session.cart.push(crystalId);
    
//     // Send back updated count as JSON
//     res.json({ cartCount: req.session.cart.length });
// });

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


/* app.post('/cart/remove/:id', (req, res) => {
    const idToRemove = req.params.id;

    if (!req.session.cart) req.session.cart = [];

    // Remove the first matching item with that id
    req.session.cart = req.session.cart.filter(item => item.id !== idToRemove);

    res.redirect('/cart');
}); */

/* app.post('/cart/remove/:id', (req, res) => {
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
    res.redirect('/cart');
}); */

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




// app.get('/cart', async (req, res) => {
//     const db = await Connection.open(mongoUri, "aura");

//     // Initialize cart if it doesn't exist
//     const cart = req.session.cart || [];

//     // Convert item IDs in the cart to integers
//     const cartIds = cart.map(id => parseInt(id));

//     // Fetch crystal items in the cart
//     const items = await db.collection('crystals').find({ item_id: { $in: cartIds } }).toArray();

//     // Calculate total price
//     const total = items.reduce((sum, item) => sum + item.price, 0);

//     res.render('checkout.ejs', { items, total });
// });

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






// ================================================================
// postlude     

const serverPort = cs304.getPort(8080);
app.listen(serverPort, function() {
    console.log(`open http://localhost:${serverPort}`);
});