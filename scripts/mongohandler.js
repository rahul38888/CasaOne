var { MongoClient } = require('mongodb');


export class MongoHandler{

	constructor(url,db_name){
		this.url = url;
		this.db_name = db_name;

		this.getDBObject(db_name);
	}

	async getDBObject(){
		if(this.db_object!=null)
			return this.db_object;

		var dbclient = await MongoClient.connect(this.url,{ useNewUrlParser: true });
		this.db_object = dbclient.db(this.db_name);

		return this.db_object;
	}
}