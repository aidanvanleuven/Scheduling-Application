var express = require('express');
var app = express();
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var connection_string = 'admin:pSjDFeQTWQ4y@127.0.0.1:27017/nodejs';
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}
var db = mongojs(connection_string , ['users', 'masterlist']);


app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

//User CRUD OPs

app.get('/users', function(req, res){
    db.users.find().sort({username : 1}, function(err, docs){
        res.json(docs);
    });

});

app.post('/users', function(req, res){
    db.users.insert(req.body, function(err, doc){
        res.json(doc);
    });
});

app.delete('/users/:id', function(req, res){
    var id = req.params.id;
    db.users.remove({_id: mongojs.ObjectId(id)}, function(err, doc){
        res.json(doc);
    });
});

app.put('/users', function (req, res) {
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

//Populate Dashboard
app.get('/data', function(req, res){
    db.users.count(function(err, doc){
        res.json(doc);
    });
});

//Classes CRUD OPs

app.get('/masterlist', function(req, res){
    db.masterlist.find().sort({lastname: 1, classname: 1, trimester: 1}, function(err, docs){
        res.json(docs);
    });

});

app.post('/masterlist', function(req, res){
    db.masterlist.insert(req.body, function(err, doc){
        res.json(doc);
    });
});

app.delete('/masterlist/:id', function(req, res){
    var id = req.params.id;
    db.masterlist.remove({_id: mongojs.ObjectId(id)}, function(err, doc){
        res.json(doc);
    });
});

app.put('/masterlist', function (req, res) {
    //var id = req.body._id;
    db.masterlist.findAndModify({
        query: {_id: mongojs.ObjectId(req.body._id)},
        update: {$set:
            {firstname: req.body.firstname, lastname: req.body.lastname, classname: req.body.classname, trimester: req.body.trimester, room: req.body.room}},
        new: true},

        function (err, doc) {
            res.json(doc);
        }
    );
});

app.listen(server_port, server_ip_address, function(){
    console.log("Listening on " + server_ip_address + ", port " + server_port);
});