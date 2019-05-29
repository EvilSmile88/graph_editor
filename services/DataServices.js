const Database = require('arangojs');
const aqlQuery = Database.aqlQuery;
const db = new Database('http://65.52.158.60:8529');

db.useBasicAuth('root', '');

db.useDatabase('_system');
const collection = db.collection('GraphData');

module.exports = {

    updateGraph : async function() {
        try {
            const bindVars = {
                user: 'artyom88',
                nodes: [322],
                lines: [],
            };
            const cursor = await db.query(aqlQuery`UPSERT { user: ${bindVars.user}} INSERT ${bindVars} UPDATE ${bindVars} IN GraphData OPTIONS { ignoreRevs: false }`);
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