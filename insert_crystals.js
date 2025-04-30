const { Connection } = require('./connection');
const cs304 = require('./cs304');
const mongoUri = cs304.getMongoUri();
const CRYSTALS_DB = 'crystals';

const { crystals } = require('./db_crystals'); 

async function insertCrystals() {
    const collection = await Connection.open(mongoUri, CRYSTALS_DB);

    const result = await collection.insertMany(crystals);
    console.log(`${result.insertedCount} crystals inserted.`);
}

insertCrystals();