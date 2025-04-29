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
const CRYSTALS_DB = 'crystals';

// Home page: display jewelry collection
app.get('/', async (req, res) => {
    let uid = req.session.uid || 'unknown';
    let visits = req.session.visits || 0;
    visits++;
    req.session.visits = visits;

    // Fetch a sample of jewelry items from the database
    const db = await Connection.open(mongoUri, ACCESSORY_DB);
    let items = await db.collection(ACCESSORY_DB).find({}).limit(10).toArray();

    return res.render('index.ejs', {uid, visits, items});
});

// Displays crystals
app.get('/crystals', async (req, res) => {
    const db = await Connection.open(mongoUri, "aura");
    let items = await db.collection('crystals').find({}).toArray();
    console.log(items.length);

    // Render the crystals.ejs template with the items array
    return res.render('crystals.ejs', { items });
});  

// ================================================================
// postlude

const serverPort = cs304.getPort(8080);
app.listen(serverPort, function() {
    console.log(`open http://localhost:${serverPort}`);
});