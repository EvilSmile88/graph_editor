var router = require('express').Router();
var graphDataServices = require('../../services/graphDataServices.js');
var internalServerError = require('../../utils/error/internalServerError');
var badRequestError = require('../../utils/error/badRequestError');
var {graphValidator} = require('../../models/validator/graph.validator');
var { nodeValidator } = require('../../models/validator/node.validator');
const joi = require('joi');
var logger = require('../../utils/logger');

// return a list of tags
function get(req, res, next) {
    graphDataServices.getGraph().then(
        function (list) {
            res.send(list);
        },
        function (err) {
            logger.error(err);
            res.status(500).send(internalServerError)
        }
    );
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

function deleteNode(req, res, next) {
    graphDataServices.removeNodes(req.body).then(
        function (graph) {
            res.send({result: 'Success'})
        },
        function (err) {
            logger.error(err);
            res.status(500).send(internalServerError)
        }
    );
}

module.exports = {
    get,
    deleteNode,
    forceUpdate,
    addNode,
};