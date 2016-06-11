var util = require('util')
db={club:{data:{},
			read:function(club_name){
				if(!(club_name in this.data)){
					this.data[club_name] = require('./database/club/'+club_name+'.json')
				}
				this.data[club_name].name = club_name
				return this.data[club_name]
			}},
	user:{data:require('./database/user.json'),
			read:function(user_id){
				return this.data[user_id];
			}}
	}
exports.db=db