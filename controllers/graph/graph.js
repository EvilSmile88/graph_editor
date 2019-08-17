var router = require('express').Router();
var graphDataServices = require('../../services/graphDataServices.js');
var internalServerError = require('../../utils/error/internalServerError');
var badRequestError = require('../../utils/error/badRequestError');
var { graphValidator } = require('../../models/validator/graph.validator');
var { nodeValidator } = require('../../models/validator/node.validator');
var { linkValidator } = require('../../models/validator/link.validator');
const joi = require('joi');
var logger = require('../../utils/logger');

// return a list of tags
function get(req, res, next) {
    setTimeout(() => {
        res.send(initGraphData);
    }, 300)
}

function forceUpdate(req, res, next) {
    joi.validate(req.body, graphValidator, function (error, value) {
        if (error) {
            logger.error(error);
            res.status(400).send(error)
        }
        graphDataServices.forceUpdateGraph(req.body).then(
            function (graph) {
                res.send({result: 'Success'})
            },
            function (err) {
                logger.error(err);
                res.status(500).send(internalServerError)
            }
        );
    });
}

function addNode(req, res, next) {
    joi.validate(req.body, nodeValidator, function (error, value) {
        if (error) {
            logger.error(error);
            res.status(400).send(error)
        }
        graphDataServices.addNode(req.body).then(
            function (node) {
                res.send({result: 'Success'})
            },
            function (err) {
                logger.error(err);
                res.status(500).send(internalServerError)
            }
        );
    });
}

function updateNode(req, res, next) {
    joi.validate(req.body, nodeValidator, function (error, value) {
        if (error) {
            logger.error(error);
            res.status(400).send(error)
        }
        graphDataServices.updateNode(req.body).then(
            function (node) {
                res.send({result: 'Success'})
            },
            function (err) {
                logger.error(err);
                res.status(500).send(internalServerError)
            }
        );
    });
}

function deleteNodes(req, res, next) {
    joi.validate(req.body, joi.array().items(nodeValidator).required(), function (error, value) {
        if (error) {
            logger.error(error);
            res.status(400).send(error)
        }
        graphDataServices.removeNodes(req.body).then(
            function (node) {
                res.send({result: 'Success'})
            },
            function (err) {
                logger.error(err);
                res.status(500).send(internalServerError)
            }
        );
    });
}

function deleteLinks(req, res, next) {
    joi.validate(req.body, joi.array().items(linkValidator).required(), function (error, value) {
        if (error) {
            logger.error(error);
            res.status(400).send(error)
        }
        graphDataServices.removeLinks(req.body).then(
            function (node) {
                res.send({result: 'Success'})
            },
            function (err) {
                logger.error(err);
                res.status(500).send(internalServerError)
            }
        );
    });
}

function addLink(req, res, next) {
    joi.validate(req.body, linkValidator, function (error, value) {
        if (error) {
            logger.error(error);
            res.status(400).send(error)
        }
        graphDataServices.addLink(req.body).then(
            function (node) {
                res.send({result: 'Success'})
            },
            function (err) {
                logger.error(err);
                res.status(500).send(internalServerError)
            }
        );
    });
}

const initGraphData = {
    id: 0,
    data: {
        nodes: [
            {
                id: '1',
                label: 'Chrisopher F.Schuetze',
                x: 493,
                y: 364,
                type: 'X',
                editable: true
            }, {
                id: '2',
                label: 'Title',
                x: 442,
                y: 365,
                type: 'X',
                editable: false
            }, {
                id: '3',
                label: 'secondary school exams',
                x: 467,
                y: 314,
                type: 'X',
                editable: false
            },{
                id: '4',
                label: '4',
                x: 467,
                y: 314,
                type: 'X',
                editable: false
            },
        ],
        links: [
            {
                source: '1',
                target: '2',
                type: 'before',
                editable: true
            },
            {
                source: '1',
                target: '3',
                type: 'far',
                editable: false
            },
        ],
        last_index: 4
    }
}

module.exports = {
    get,
    deleteNodes,
    forceUpdate,
    addNode,
    updateNode,
    deleteLinks,
    addLink
};