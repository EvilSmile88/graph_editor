const {dataBaseURL, dataBaseAuthName, dataBaseAuthPassword} = require("../config/keys");
var logger = require('../utils/logger');

const Database = require('arangojs');
const aqlQuery = Database.aqlQuery;
const db = new Database(dataBaseURL);
db.useBasicAuth(dataBaseAuthName, dataBaseAuthPassword);

db.useDatabase(process.env.DB || 'graph-dev');

module.exports = {

    // Updates all graph data included nodes and relationship between nodes.
    // Stores data in Arango DB Edge collection
    updateGraph: async function (graph) {
        graph.links.forEach(async function (link, index) {
            try {
                const edge = {...link, '_from': `GraphNodes/${link.source}`, '_to': `GraphNodes/${link.target}`};
                await db.query(aqlQuery`UPSERT { source: ${link.source}, target: ${link.target}} INSERT ${edge} UPDATE ${edge} IN GraphDataEdge`);
            } catch (err) {
                console.log(err)
            }
        });
        graph.nodes.forEach(async function (node, index) {
            try {
                const newNode = {...node, '_key': `${node.id}`};
                await db.query(aqlQuery`UPSERT { id: ${graph.nodes[index].id}} INSERT ${newNode} UPDATE ${newNode} IN GraphNodes`);
            } catch (err) {
                console.log(err)
            }
        });
        try {
           const storedNodes = await this.getNodes();
           const removedNodes = storedNodes
               .filter(storedNode => !graph.nodes.find(currentNode => currentNode.id === storedNode.id));
           if (removedNodes.length) {
              await this.removeNodes(removedNodes)
           }
        } catch (err) {
            console.log(err)
        }
        try {
            const storedLinks = await this.getLinks();
            const removedLinks = storedLinks
                .filter(storedLink => !graph.links.find(currentLink => currentLink.source === storedLink.source && currentLink.target === storedLink.target));
            if (removedLinks.length) {
                await this.removeLinks(removedLinks)
            }
        } catch (err) {
            console.log(err)
        }
        try {
            const cursor = await db.query(aqlQuery`UPSERT { user: ${graph.user}} INSERT ${graph} UPDATE ${graph} IN GraphData`);
            const result = await cursor.all();
            return result;
        } catch (err) {
            console.log(err)
        }
    },


    removeNodes: async function (nodes) {
        nodes.forEach(async function (node) {
            try {
                await db.query(aqlQuery`FOR node IN GraphNodes FILTER node.id == ${node.id} REMOVE node IN GraphNodes`);
                await db.query(aqlQuery`FOR link IN GraphDataEdge FILTER link.source == ${node.id} || link.target == ${node.id} REMOVE link IN GraphDataEdge`);
            } catch (err) {
                console.log(err)
            }
        })
    },

    removeLinks: async function (links) {
        links.forEach(async function (link) {
            try {
                await db.query(aqlQuery`FOR link IN GraphDataEdge FILTER link.source == ${link.source} && link.target == ${link.target} REMOVE link IN GraphDataEdge`);
            } catch (err) {
                console.log(err)
            }
        })
    },

    getGraph: async function () {
        try {
            const cursor = await db.query(aqlQuery`FOR x IN GraphData RETURN x`);
            const result = await cursor.next();
            return result;
        } catch (err) {
            console.log(err)
        }
    },

    getNodes: async function () {
        try {
            const cursor = await db.query(aqlQuery`FOR x IN GraphNodes RETURN x`);
            const result = await cursor.all();
            return result;
        } catch (err) {
            console.log(err)
        }
    },

    getLinks: async function () {
        try {
            const cursor = await db.query(aqlQuery`FOR x IN GraphDataEdge RETURN x`);
            const result = await cursor.all();
            return result;
        } catch (err) {
            console.log(err)
        }
    },
}