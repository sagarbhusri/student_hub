var util = require('util')
var fs= require('fs')
var execSync = require('child_process').execSync

exports.dumpJson = dumpJson = (jobj,file_path)=>{
	fs.writeFile(file_path,JSON.stringify(jobj,null,4),(err)=>{
		util.log(err)
	});
}

db={club:{  info:{},
			news:{},
			events:{},
			read:(club_name,DATATYPE)=>{
				var club = this.db.club
				var DATATYPE = DATATYPE || 'info'

				if(!(club_name in club[DATATYPE])){
					try{
						club[DATATYPE][club_name] = require('./database/club/'+DATATYPE+'/'+club_name+'.json')
					}
					catch(e){
						club[DATATYPE][club_name] = {}
					}
				}
				club[DATATYPE][club_name].name = club_name
				club[DATATYPE][club_name].datatype = DATATYPE
				return club[DATATYPE][club_name]
				},

			write:(data_obj,club_name,datatype)=>{
				var club = this.db.club
				var datatype = datatype || 'info';
				club.read(club_name,datatype)
				switch(datatype){
					case 'events':
					case 'news':
						club[datatype][club_name][Math.random().toString()]=data_obj
						break;
					case 'info':

				}	
				dumpJson(club[datatype][club_name],'database/club/'+datatype+'/'+club_name+'.json')
				}
		},
	user:{data:require('./database/user.json'),
			read:function(user_id){
				return this.data[user_id];
			}}
	}
exports.db=db