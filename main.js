var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')
var db = require('./db_controller.js').db
var util = require('util')
var app = express();

app.use(session({
	saveUninitialized:false,
	secret:'mouse on the house',
	resave:true
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname+"/static"));
app.set('view engine','pug')
app.set('views',__dirname+'/views')

app.all('/',function(req,res) {
	util.log("PID: "+process.pid)
	switch(req.method){
	case 'GET':res.render('login');break;
	case 'POST':var userid=req.body.userid
				if(db.user.read(userid).password == req.body.password){
					req.session.user = {id:req.body.userid}
					res.redirect("/3ctech/home");
				}
				break;
	}
});

app.get('/:club_name/home', function (req, res) {
	var club_name = req.params.club_name
	res.render('event_home',db.club.read(club_name))
})

app.get('/:club_name/event/:query',function (req,res) {
	console.log("user data: ",req.session.user)
	var club_name = req.params.club_name;
	var query = req.params.query;
	if(query=="previous") 
		res.render('previousevent',{club_name:club_name})
	else if(query=="upcoming")
		res.render('upcomingevent',{club_name:club_name})
	}
)
app.listen(8081, function () {
  	util.log("Server listening at http://localhost:8081")
	})
