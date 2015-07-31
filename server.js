var express = require('express');
var _ = require('underscore');
var app = express();
var session = require('express-session');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var connection_string = 'admin:pSjDFeQTWQ4y@127.0.0.1:27018/nodejs';
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

//User CRUD Methods

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

//Dashboard Methods
app.get('/data/users', function(req, res){
    db.users.count(function(err, doc){
        res.json(doc);
    });
});

app.get('/data/entries', function(req, res){
    db.masterlist.count(function(err, doc){
        res.json(doc);
    });
});

//Classes CRUD Methods

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

//App Methods

app.get('/getTeachers', function(req, res){
    db.masterlist.find({},{firstname:1,lastname:1}, function(err, doc){
        var uniqueList = _.uniq(doc, function(item, key, firstname){
            return item.lastname;
        });
        res.json(uniqueList);
    });
});

app.post('/deleteSchedule', function(req,res){
    db.users.find({_id:mongojs.ObjectId(req.body.user)}, function(err,doc){
        var newArray = [];
        for(var i=0;i<doc[0].teacherclasses.length;i++){
            var schedules = doc[0].teacherclasses[i];
            if (schedules.trimester !== req.body.trimester){
                newArray.push(schedules);
            }

        }
        console.log(newArray);
        db.users.findAndModify({
            query: {_id: mongojs.ObjectId(req.body.user)},
            update:{$set:{teacherclasses:newArray}}
        }, function (err,doc){
            res.json(doc);
        });
    });
});

app.post('/getSchedules', function(req,res){
    db.users.find({_id: mongojs.ObjectId(req.body.id)}, function(err,doc){
        res.json(doc[0].teacherclasses);
    });
});

app.post('/getTrimesters', function(req,res){
    db.users.find({_id: mongojs.ObjectId(req.body.id)}, function(err,doc){
        if (doc.length !== 0){
            var uniqueList = _.uniq(doc[0].teacherclasses, function(item,key,trimester){
                return item.trimester;
            });
            res.json(uniqueList);
        }
        else{
            res = undefined;
        }
    });
});

app.post('/getClasses', function(req,res){
    db.masterlist.find({firstname: req.body.teacher.firstname, lastname:req.body.teacher.lastname, trimester:req.body.trimester},{classname:1}, function(err,doc){
        var uniqueList = _.uniq(doc, function(item, key, classname){
            return item.classname;
        });
        res.json(uniqueList);
    });
});

app.post('/getEntry', function(req,res){
    db.masterlist.find({firstname: req.body.teacher.firstname, lastname:req.body.teacher.lastname, trimester:req.body.trimester, classname:req.body.class.classname}, function(err,doc){
        res.json(doc);
    });
});

app.post('/submitSchedule', function(req,res){
    db.users.findAndModify({
        query: {_id: mongojs.ObjectId(req.body.userId[0].userId)},
        update: {
            $push:{teacherclasses:{$each: req.body.teacherclasses}}
        }
    }, function(err, doc){
        res.json(doc);
    });
});

//Login + Register Methods
app.post('/login', function(req,res){
    db.users.findOne({username: req.body.username, password:req.body.password}, {_id:1, admin:1}, function(err, doc){
        res.json(doc);
    });
});

app.post('/register', function(req,res){
    console.log(req.body);
    db.users.insert({username:req.body.username, password:req.body.password, firstname:req.body.firstname, admin:false}, function(err,doc){
        res.json(doc);
    });
});

//Initialize Server

app.listen(server_port, server_ip_address, function(){
    console.log("Listening on " + server_ip_address + ", port " + server_port);
});