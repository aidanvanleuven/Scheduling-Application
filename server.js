var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('skyline_db', ['users']);
var bodyParser = require('body-parser');
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get('/skyline_db', function(req, res){
    db.users.find(function(err, docs){
        res.json(docs);
    });

});

app.post('/skyline_db', function(req, res){
    db.users.insert(req.body, function(err, doc){
        res.json(doc);
    });
});

app.delete('/skyline_db/:id', function(req, res){
    var id = req.params.id;
    db.users.remove({_id: mongojs.ObjectId(id)}, function(err, doc){
        res.json(doc);
    });
});

app.put('/skyline_db', function (req, res) {
    //var id = req.body._id;
    db.users.findAndModify({
        query: {_id: mongojs.ObjectId(req.body._id)},
        update: {$set: {username: req.body.username, firstname: req.body.firstname, password: req.body.password, admin: req.body.admin}},
        new: true},

        function (err, doc) {
            res.json(doc);
        }
    );
});

app.listen(server_port, server_ip_address, function(){
    console.log("Listening on " + server_ip_address + ", port " + port);
});