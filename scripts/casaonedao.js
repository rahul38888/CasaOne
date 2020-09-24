const MongoHandler = require('../scripts/mongohandler');
var assert = require('assert');

class CassaoneDao{

	constructor(url,db_name){
		this.max_last_assemblies_count = 5;
		this.mongo_handler = new MongoHandler(url,db_name);
	}

	async getdbObject(){
		return await this.mongo_handler.getDBObject();
	}

	async addNewAssemblyTime(productId,time){
		var dbo =  await this.mongo_handler.getDBObject();

		var productinfo = await this.getProductInfo(productId);

		if(productinfo==undefined){
			console.error("No product found for productid: "+productId);
			throw new Error("No product found for productid: "+productId);
		}

		var assemblies = productinfo.lastassemblies;
		assemblies.shift();
		assemblies.push(time);

		if(assemblies.length!=this.max_last_assemblies_count){
			console.error("Last assemblies list size is not "+this.max_last_assemblies_count);
			throw new Error("Last assemblies list size is not "+this.max_last_assemblies_count);
		}

		var average_atime = assemblies.reduce((a, b) => (a + b))/assemblies.length;

		await dbo.collection('productinfo').updateOne(
			{_id:productId},
			{ $set: {assemblytime: average_atime,lastassemblies:assemblies}},
			function(err, res) {
				if (err) throw err;
				console.info("Product info updated with (productid,assemblytime,lastassemblies): ("+productinfo.productid+","+average_atime+",["+assemblies+"])");
			  }
			);

		return {productid:productId,assemblytime:average_atime,lastassemblies:assemblies}
	}

	async insertProductInfo(productinfo){
		var dbo =  await this.mongo_handler.getDBObject();

		await dbo.collection('productinfo').insertOne(productinfo, function(err, res) {
			if (err) throw err;
			console.info("Product info inserted: "+productinfo.productid);
		  });
	}

	async getProductInfo(productid){
		var dbo = await this.mongo_handler.getDBObject();

		var productinfolist = await dbo.collection('productinfo').find({_id:productid}).toArray();

		return productinfolist[0];
	}
}

module.exports = CassaoneDao;