var router = require('express').Router();
var graphDataServices = require('../../services/graphDataServices.js');
var internalServerError = require('../../utils/error/internalServerError');
var badRequestError = require('../../utils/error/badRequestError');
var { graphValidator } = require('../../models/validator/graph.validator');
const joi = require('joi');

// return a list of tags
function get(req, res, next) {
  graphDataServices.getGraph().then(
    function (list) {
      res.send(list);
    },
    function (err) {
      console.log(e);
      res.status(500).send(internalServerError)
    }
  );
}

function update(req, res, next) {
  joi.validate(req.body, graphValidator, function (error, value) {
    if (error){
      res.status(400).send(error)
    }
    graphDataServices.updateGraph(req.body).then(
      function (graph) {
        res.send({result: 'Success'})
      },
      function (err) {
        console.log(e);
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
      console.log(e);
      res.status(500).send(internalServerError)
    }
  );
}
module.exports = {
  get,
  deleteNode,
  update
};