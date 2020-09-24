var { Db, Server } = require('mongodb');


export class MongoHandler{

	constructor(host,port,db_name){
		this.host = host;
		this.port = port;
		this.db_name = db_name;

		this.getDBObject(db_name);
	}

	getDBObject(){
		if(this.db_object!=null)
			return this.db_object;

		this.db_object = new Db(this.db_name, new Server(this.host, this.port));

		console.log("New db connection created");
		return this.db_object;
	}
}