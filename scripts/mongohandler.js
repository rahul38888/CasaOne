var { MongoClient } = require('mongodb');
class MongoHandler{

	constructor(url,db_name){
		this.url = url;
		this.db_name = db_name;

		this.getDBObject(db_name);
	}

	async getDBObject(){
		if(this.db_object!=null && this.dbclient!=null && this.dbclient.isConnected())
			return this.db_object;

		this.dbclient = await MongoClient.connect(this.url,{ useNewUrlParser: true });
		this.db_object = this.dbclient.db(this.db_name);
		console.info("New db object created : "+this.url+"/"+this.db_name);

		return this.db_object;
	}
}

module.exports = MongoHandler;