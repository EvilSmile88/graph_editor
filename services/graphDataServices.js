const {dataBaseURL, dataBaseAuthName, dataBaseAuthPassword} = require("../config/keys");
var logger = require('../utils/logger');

var Database = require('arangojs');
const aqlQuery = Database.aqlQuery;
const db = new Database(dataBaseURL, {arangoVersion: 20809});
db.useBasicAuth(dataBaseAuthName, dataBaseAuthPassword);

db.useDatabase(process.env.DB || 'graph-dev');

const nodesCollection = db.collection('GraphNodes');
const graph = db.graph("TestGraph");
const collection = graph.edgeCollection("GraphDataEdge");

module.exports = {

    // Updates all graph data included nodes and relationship between nodes.
    // Stores data in Arango DB Edge collection
    forceUpdateGraph: async function (graph) {
        graph.links.forEach( (link) => {
            this.addLink(link)
        });
        graph.nodes.forEach(async function (node, index) {
            try {
                const newNode = {...node, '_key': `${node.id}`};
                await db.query(aqlQuery`UPSERT { id: ${graph.nodes[index].id}} INSERT ${newNode} UPDATE ${newNode} IN GraphNodes`);
            } catch (err) {
                logger.error(err.message);
                throw err;
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
            logger.error(err.message);
            throw err;
        }
        try {
            const storedLinks = await this.getLinks();
            const removedLinks = storedLinks
                .filter(storedLink => !graph.links.find(currentLink => currentLink.source === storedLink.source && currentLink.target === storedLink.target));
            if (removedLinks.length) {
                await this.removeLinks(removedLinks)
            }
        } catch (err) {
            logger.error(err.message);
            throw err;
        }
    },

    // Add new node to document collection
    // This method uses AQL query type and demonstrates how to protect from SQL Injection attacks with AQL bind parameters
    addNode: async function (node) {
        try {
            const newNode = {...node, '_key': `${node.id}`};
            //This method is not safe to SQL Injection attacks
            //const result = await db.query(aqlQuery`INSERT ${newNode} IN GraphNodes`);

            //Preferable to use bind vars to protect from SQL injection attacks
            await db.query({
              query: "INSERT @newNode IN GraphNodes",
              bindVars: { newNode: newNode }
            });
            return newNode;
        } catch (err) {
            logger.error(err.message);
            throw err;
        }
    },

    //Updates existing node in document collection.
    //This method uses normal AQL Query without regular template string
    updateNode: async function (node) {
        try {
            const result = await db.query(aqlQuery`UPSERT { id: ${node.id}} INSERT ${node} UPDATE ${node} IN GraphNodes`);
            return result;
        } catch (err) {
            logger.error(err.message);
            throw err;
        }
    },


    // Removes node from Edge collection
    // Gets edge from Edge collection and returns all related edges
    removeNodes: async function (nodes) {
        nodes.forEach(async function (node) {
            try {
                //
                //await db.query(aqlQuery`FOR node IN GraphNodes FILTER node.id == ${node.id} REMOVE node IN GraphNodes`);
                const edges = await collection.edges(`GraphNodes/${node.id}`);
                edges.map(async edge => { await collection.remove(edge._id);});
            } catch (err) {
                logger.error(err.message);
                throw err;
            }
        })
    },

    // Removes link from Edge collection
    removeLinks: async function (links) {
        links.forEach(async function (link) {
            try {
                const result = await collection.remove(`GraphDataEdge/${link.source}-${link.target}`);
                return result;
            } catch (err) {
                logger.error(err.message);
                throw err;
            }
        })
    },

    // Inserts new edge to Edge collection.
    addLink: async function (link) {
        try {
              const edge = {...link, '_key': `${link.source}-${link.target}`};
              const result = await collection.save(edge, `GraphNodes/${link.source}`, `GraphNodes/${link.target}`);
              return result;
        } catch (err) {
            logger.error(err.message);
            throw err;
        }
    },

    // Returns all nodes from document collection.
    // Uses plain AQL query
    getGraph: async function () {
        try {
            const cursor = await db.query(aqlQuery`FOR x IN GraphData RETURN x`);
            const result = await cursor.next();
            return result;
        } catch (err) {
            logger.error(err.message);
            throw err;
        }
    },

    // Returns all nodes from document collection.
    // Uses plain AQL query
    getNodes: async function () {
        try {
            const cursor = await db.query(aqlQuery`FOR x IN GraphNodes RETURN x`);
            const result = await cursor.all();
            return result;
        } catch (err) {
            logger.error(err.message);
            throw err;
        }
    },

    // Returns all edges from edge collection.
    // Uses plain AQL query
    getLinks: async function () {
        try {
            const cursor = await db.query(aqlQuery`FOR x IN GraphDataEdge RETURN x`);
            const result = await cursor.all();
            return result;
        } catch (err) {
            logger.error(err.message);
            throw err;
        }
    },
}