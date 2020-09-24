const { MongoHandler } = require('../scripts/mongohandler');
var assert = require('assert');

export class CassaoneDao{


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

		var old_assemblies = productinfo.lastassemblies;
		old_assemblies.shift();
		old_assemblies.push(time);

		assert.strictEqual(old_assemblies.length,this.max_last_assemblies_count);

		var average_atime = old_assemblies.reduce((a, b) => (a + b))/old_assemblies.length;

		await dbo.collection('productinfo').updateOne(
			{_id:productId},
			{ $set: {assemblytime: average_atime,lastassemblies:old_assemblies}},
			function(err, res) {
				if (err) throw err;
				console.info("Product info updated with (productid,assemblytime,lastassemblies): ("+productinfo.productid+","+average_atime+",["+old_assemblies+"])");
			  }
			);

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

		var productinfolist = await dbo.collection('productinfo').find({productid:productid}).toArray();

		return productinfolist[0];
	}
}