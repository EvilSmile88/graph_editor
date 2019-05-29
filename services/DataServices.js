const { dataBaseURL, dataBaseAuthName, dataBaseAuthPassword } = require("../config/keys");

const Database = require('arangojs');
const aqlQuery = Database.aqlQuery;
const db = new Database(dataBaseURL);

db.useBasicAuth(dataBaseAuthName, dataBaseAuthPassword);

db.useDatabase('_system');
const collection = db.collection('GraphData');

module.exports = {
    updateGraph : async function(graph) {
        try {
            const cursor = await db.query(aqlQuery`UPSERT { user: ${graph.user}} INSERT ${graph} UPDATE ${graph} IN GraphData`);
            const result = await cursor.all();
            return result;
        } catch (err) { console.log(err) }
    },

    getGraph : async function() {
        try {
            const cursor = await db.query(aqlQuery`FOR x IN GraphData RETURN x`);
            const result = await cursor.next();
            return result;
        } catch (err) { console.log(err) }
    },
}