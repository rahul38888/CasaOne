const { MongoHandler } = require('../scripts/mongohandler');

export class CassaoneDao{

	constructor(url,db_name){
		this.mongo_handler = new MongoHandler(url,db_name);
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

	async getProductInfo(productid){
		var dbo = await this.mongo_handler.getDBObject();

		var productinfolist = await dbo.collection('productinfo').find({productid:productid}).toArray();

		return productinfolist[0];
	}
}