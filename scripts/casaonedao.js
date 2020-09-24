const { MongoHandler } = require('../scripts/mongohandler');

export class CassaoneDao{

	constructor(host,port,db_name){
		this.mongo_handler = new MongoHandler(host,port,db_name);
	}

	updateAssemblyTime(productId,time){
		var dbo =  this.mongo_handler.getDBObject();

		dbo.collection('productinfo').updateOne(
			{id:productId},
			{ $set: {atime: time} },
			function(err, res) {
				if (err) throw err;
				console.info("1 document updated");
			  }
			);
	}

	insertProductInfo(productinfo){
		var dbo =  this.mongo_handler.getDBObject();

		dbo.collection('productinfo').insertOne(productinfo, function(err, res) {
			if (err) throw err;
			console.log("1 document inserted");
		  });
	}

	async getProductInfo(productId){
		var dbo =  this.mongo_handler.getDBObject();

		return dbo.collection('productinfo').find({id:productId}).next();
	}
}