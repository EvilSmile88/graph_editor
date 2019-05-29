var service = require('../services/DataServices.js');

module.exports = app => {
    app.get('/api/graph', function(req, res){
        service.getGraph().then(
            function (list) {
                res.send(list);
            },
            function (err) {
                console.log(e);
                res.status(500).send({error: 'Internal server error!'})
            }
        );
  });

    app.post('/api/graph', function(req, res){
       service.updateGraph().then(
           function (graph) {
               console.log(33333, graph);
               res.send({result: 'Success'})
           },
           function (err) {
               console.log(e);
               res.status(500).send({error: 'Internal server error!'})
           }
       );
    });
};
