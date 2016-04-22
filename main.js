var express = require('express');
var fs = require('fs');
fs.readFile('data.json',(err,data)=>{
		db = JSON.parse(data);
		start_server();
	})

var app = express();

app.use(express.static(__dirname+"/static"));
app.set('view engine','pug')
app.set('views',__dirname+'/views')

app.get('/event/:club_name', function (req, res) {
	var club_name = req.params.club_name
	console.log(db[club_name])
	res.render('event_home',db[club_name])
})

function start_server(){
  app.listen(8081, function () {
  	console.log("Example app listening at http://localhost:8081")
	})
}
