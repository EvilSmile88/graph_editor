const Database = require('arangojs');
const aqlQuery = Database.aqlQuery;
const db = new Database({ url: 'http://127.0.0.1:8529' });
db.useBasicAuth('root', '');
db.useDatabase('graphDataBase');

module.exports = {

    updateGraph : async function() {
        try {
            const bindVars = {
                user: 'artyom88',
                nodes: [22242],
                lines: [],
            };
            // const cursor = await db.query('FOR x IN Graph FILTER x.user == @user UPDATE x WITH { user:@user, nodes:@nodes, lines:@lines } IN graph',bindVars );
            const cursor = await db.query(aqlQuery`FOR x IN GraphData FILTER x.user == ${bindVars.user} UPDATE x WITH ${bindVars} IN GraphData`);
            const result = await cursor.all();
            return result;
        } catch (err) { console.log(err) }
    },

    getAllUsers : async function() {
        try {
            const cursor = await db.query('FOR x IN User RETURN x');
            const result = await cursor.all();

            return result;
        } catch (err) { console.log(err) }
    },

    postUser : async function() {
        const user = {
            username: "xxxashish",
            email: "xxxxashis@ashis.com"
        };
        try {
            const cursor = await db.query(`INSERT ${user} IN User`);
            const result = await cursor.next();
            return result;
        } catch (err) { console.log(err) }
    },
}