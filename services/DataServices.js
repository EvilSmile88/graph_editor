const Database = require('arangojs');
const aqlQuery = Database.aqlQuery;
const db = new Database();

db.useBasicAuth('root', '');

db.useDatabase('_system');
const collection = db.collection('GraphData');

if(!collection.exist) {
    db.collection('GraphData').create().then(
        () => console.log('Collection created'),
        err => console.error('Failed to create collection:')
    );
}

module.exports = {

    updateGraph : async function() {
        try {
            const bindVars = {
                user: 'artyom88',
                nodes: [222],
                lines: [],
            };
            const cursor = await db.query(aqlQuery`UPSERT { user: ${bindVars.user}} INSERT ${bindVars} UPDATE ${bindVars} IN GraphData OPTIONS { ignoreRevs: false }`);
            const result = await cursor.all();
            return result;
        } catch (err) { console.log(err) }
    },
}