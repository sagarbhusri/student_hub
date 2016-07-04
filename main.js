var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')
var multer = require('multer')
var dateformat = require('dateformat')
var database = require('./db_controller.js')
var db = database.db
var util = require('util')
var app = express();



date_structure = (datetime)=>{
	console.log(datetime)
	if (datetime == '')
		datetime = new Date()
	else{
		datetime = new Date(datetime.split('T')[0]+" "+datetime.split('T')[1])
	}
	console.log(datetime)
	datetime = datetime.toString()
	var date = datetime.split(' ');
	var time = date[4].split(':');
	return {
		string:datetime,
		date:  {day_of_week:date[0],
				month:date[1],
				date:date[2],
				year:date[3]},
		time:  {hour:time[0],
				minute:time[1],
				second:time[2]},
		timezone:date[5],
		country:date[6]
	}
}

function is_admin(club_name){
	return true;
}

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
app.get('/contact_us',function(req,res) {
	res.render('contact_us');
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


app.get('/gallery',function(req,res) {
	res.render('gallery')
});


app.get('/:club_name/home', function (req, res) {
	var club_name = req.params.club_name
	//console.log(db.club.read(club_name))
	data=db.club.read(club_name);
	data['admin']=is_admin(club_name);
	res.render('club_home',db.club.read(club_name))
})


app.get('/:club_name/news',(req,res)=>{
	var club_name = req.params.club_name;
	var news_list = db.club.read(club_name,'news');
	delete news_list.club_name
	delete news_list.datatype	
	res.render('news/index',{club_name:club_name,
					   admin:is_admin(club_name),
					   news_list:news_list})
	})


app.get('/:club_name/news/upload',(req,res)=>{
	res.render('news/upload');
})
app.post('/:club_name/news/upload',(req,res)=>{
	var club_name = req.params.club_name;
	// date_structure
	// {
	// 	date:  {day_of_week:date[0],
	// 			month:date[1],
	// 			date:date[2],
	// 			year:date[3]},
	// 	time:  {hour:time[0],
	// 			minute:time[1],
	// 			second:time[2]},
	// 	timezone:date[5],
	// 	country:date[6]
	// }

	var news = {
		title:req.body.title,
		para:req.body.para,
		datetime:date_structure(Date())}
	if (req.file)
		news.image={path:'/resources/images/uploads/'+req.file.filename,
			   		mimetype:req.file.mimetype}

	db.club.write(news,club_name,'news')
	res.redirect('/'+club_name+'/news')
})

app.get('/:club_name/event/upload',(req,res)=>{
	res.render('event/upload')
})

app.post('/:club_name/event/upload',(req,res)=>{
	var club_name = req.params.club_name;
	console.log(req.body)
	var event = {
		title:req.body.title,
		description:req.body.description,
		datetime: date_structure(req.body.datetime),
		image:{path:'#'}
	}
	if (req.file)
		event.image={path:'/resources/images/uploads/'+req.file.filename,
			   		 mimetype:req.file.mimetype}

	db.club.write(event,club_name,'events')
	res.redirect('/'+club_name+'/event/upcoming')
})

app.get('/:club_name/event/:query',function (req,res) {
	console.log("user data: ",req.session.user)
	var club_name = req.params.club_name;
	var query = req.params.query;
	var event_list = db.club.read(club_name,'events')
	delete event_list.club_name
	delete event_list.datatype
	console.log(event_list)
	for(event in event_list){
		if(event.datetime){
		console.log(event.datetime.string)
		console.log(event.datetime.string > Date().toString())
		}
	}
	res.render('event/index',{club_name:club_name,
							event_list:event_list,
							query:query})
	}

)
app.listen(8081, function () {
  	util.log("Server listening at http://localhost:8081")
	})
