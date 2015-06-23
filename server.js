var express = require('express');
var app = express();
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var connection_string = '127.0.0.1:27017/nodejs';
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}
var db = mongojs(connection_string , ['users']);


app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get('/nodejs', function(req, res){
    db.users.find(function(err, docs){
        res.json(docs);
    });

});

app.post('/nodejs', function(req, res){
    db.users.insert(req.body, function(err, doc){
        res.json(doc);
    });
});

app.delete('/nodejs/:id', function(req, res){
    var id = req.params.id;
    db.users.remove({_id: mongojs.ObjectId(id)}, function(err, doc){
        res.json(doc);
    });
});

app.put('/nodejs', function (req, res) {
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
    console.log("Listening on " + server_ip_address + ", port " + server_port);
});