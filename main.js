var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')
var multer = require('multer')
var database = require('./db_controller.js')
var db = database.db
var util = require('util')
var app = express();

app.use(session({
	saveUninitialized:false,
	secret:'mouse on the house',
	resave:true
}))
app.use(multer({dest:'./static/resources/images/uploads/'}).single('photo'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname+"/static"));
app.set('view engine','pug')
app.set('views',__dirname+'/views')

app.get('/front',function(req,res) {
	res.render('front');
});

app.all('/',function(req,res) {
	util.log("PID: "+process.pid)
	switch(req.method){
	case 'GET':res.render('login');break;
	case 'POST':var userid=req.body.userid
				if(db.user.read(userid).password == req.body.password){
					req.session.user = {id:req.body.userid}
					res.redirect("/front/");
				}
				break;
	}
});

app.get('/news',function(req,res) {
	res.render('news',{
					   news_list:[{
							   		date:{year:"2016",month:"June",day:"10"},
							   		title:"Demise of IT industry",
							   		para:["semper ac, venenatis at, facilisis ac,\
									   		magna. Etiam ac enim. Sed pellentesque euismod\
									   		elit. Mauris auctor ultrices massa. Praesent eget\
									   		erat ut turpis aliquet viverra. Nullam consectetuer,\
									   		risus ut condimentum dictum, tortor urna placerat \
									   		leo, eleifend dictum lacus purus at tortor.\
									   		Integer pulvinar. Etiam eget leo eget turpis imperdiet dictum."]
						   			},
						   			{
							   		date:{year:"2016",month:"June",day:"10"},
							   		title:"Demise of IT industry",
							   		para:["semper ac, venenatis at, facilisis ac,\
									   		magna. Etiam ac enim. Sed pellentesque euismod\
									   		elit. Mauris auctor ultrices massa. Praesent eget\
									   		erat ut turpis aliquet viverra. Nullam consectetuer,\
									   		risus ut condimentum dictum, tortor urna placerat \
									   		leo, eleifend dictum lacus purus at tortor.\
									   		Integer pulvinar. Etiam eget leo eget turpis imperdiet dictum."]
						   			}
					   			]	
					   }
								)
		});

app.get('/gallery',function(req,res) {
	res.render('gallery')
});



app.get('/:club_name/home', function (req, res) {
	var club_name = req.params.club_name
	//console.log(db.club.read(club_name))
	res.render('club_home',db.club.read(club_name))
})

app.get('/:club_name/news',(req,res)=>{
	
	res.render('news',{club_name:req.params.club_name,
							   news_list:[{
									   		date:{year:"2016",month:"June",day:"10"},
									   		title:"Demise of IT industry",
									   		para:["semper ac, venenatis at, facilisis ac,\
											   		magna. Etiam ac enim. Sed pellentesque euismod\
											   		elit. Mauris auctor ultrices massa. Praesent eget\
											   		erat ut turpis aliquet viverra. Nullam consectetuer,\
											   		risus ut condimentum dictum, tortor urna placerat \
											   		leo, eleifend dictum lacus purus at tortor.\
											   		Integer pulvinar. Etiam eget leo eget turpis imperdiet\
											   		 dic."]
								   			}
							   			]	
							   }
							)
	// res.render('event/upload',{club_name:req.params.club_name,
	// 						   news_list:news_list}) 	
	})

app.get('/:club_name/event/upload',(req,res)=>{
	res.render('event/upload')
})

app.post('/:club_name/event/upload',(req,res)=>{
	var club_name = req.params.club_name;
	var event = {
		title:req.body.title,
		description:req.body.description,
		datetime: Date(req.body.datetime),
		image:{path:'/resources/images/uploads/'+req.file.filename,
			   mimetype:req.file.mimetype
			  }
	}
	db.club.write(event,club_name,'events')
	util.log(db.club.events)
	res.redirect('/'+club_name+'/event/upcoming')
})

app.get('/:club_name/event/:query',function (req,res) {
	console.log("user data: ",req.session.user)
	var club_name = req.params.club_name;
	var query = req.params.query;
	var event_list = db.club.read(club_name,'events')
	delete event_list.name
	delete event_list.datatype

	res.render('event/index',{club_name:club_name,
							event_list:event_list,
							query:query})
	}

)
app.listen(8081, function () {
  	util.log("Server listening at http://localhost:8081")
	})
