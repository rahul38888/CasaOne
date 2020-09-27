const MongoHandler = require('../scripts/mongohandler');
var assert = require('assert');

const sortbymap = {"rating":"overallrating",'atime':"assemblytime",'price':"pricepermonth"};

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

		if(assemblies.length>this.max_last_assemblies_count){
			console.warn("Past assemblies list size should not be more than "+this.max_last_assemblies_count);
		}

		var average_atime = assemblies.reduce((a, b) => (a + b))/assemblies.length;

		await dbo.collection('productinfo').updateOne(
			{_id:productId},
			{ $set: {assemblytime: average_atime,lastassemblies:assemblies}}
		);

		console.info("Product info updated with (productid,assemblytime,lastassemblies): ("+productinfo.productid+","+average_atime+","+JSON.stringify(assemblies)+")");

		return {productid:productId,assemblytime:average_atime,lastassemblies:assemblies};
	}

	async addNewRatingvalue(productId,rating){
		if(rating<1 || rating>5){
			console.error("Invalid rating value: "+rating);
			throw new Error("Invalid rating value: "+rating);
		}
		var dbo =  await this.mongo_handler.getDBObject();

		var productinfo = await this.getProductInfo(productId);

		if(productinfo==undefined){
			console.error("No product found for productid: "+productId);
			throw new Error("No product found for productid: "+productId);
		}

		var ratingcounts = productinfo.ratingcounts;

		ratingcounts[rating]++;

		var multsum = 0;
		var count = 0;
		for(var [key,value] of Object.entries(ratingcounts)){
			multsum=multsum+key*value;
			count=count+value;
		}

		var newoverallrating = multsum/count;

		await dbo.collection('productinfo').updateOne(
			{_id:productId},
			{ $set: {overallrating: newoverallrating,ratingcounts:ratingcounts}}
		);

		console.info("Product info updated with (productid,overallrating,ratingcounts): ("+productinfo.productid+","+newoverallrating+","+JSON.stringify(ratingcounts)+")");

		return {productid:productId,overallrating: newoverallrating,ratingcounts:ratingcounts};
	}

	async insertProductInfo(productinfo){
		var dbo =  await this.mongo_handler.getDBObject();

		await dbo.collection('productinfo').insertOne(productinfo, function(err, res) {
			if (err) throw err;
			console.info("Product info inserted: "+productinfo.productid);
		  });
	}

	async productListing(query){
		var dbo = await this.mongo_handler.getDBObject();

		var find= this.findfilterJson(query);
		var sort = this.sortJson(query);

		var productlist = await dbo.collection('productinfo').find(find).sort(sort).toArray();

		return productlist;

	}

	sortJson(query){
		var sortorder = query.sortorder=="desc"?-1:1;
		var sortby = sortbymap[query.sortby]

		return JSON.parse("{\""+sortby+"\":"+sortorder+"}");
	}

	findfilterJson(query) {
		var findfilter = {};
		if(query.productid)
			findfilter._id = query.productid;

		if(query.color)
			findfilter.color = query.color;

		if(query.atimerange){
			var filter = {};
			if(query.atimerange.max)
				filter["$lte"] = query.atimerange.max;

			if(query.atimerange.min)
				filter["$gte"] = query.atimerange.min;

			if(Object.keys(filter).length>0)
				findfilter.assemblytime = filter;
		}

		if(query.ratingrange){
			var filter = {};
			if(query.ratingrange.max)
				filter["$lte"] = query.ratingrange.max;

			if(query.ratingrange.min)
				filter["$gte"] = query.ratingrange.min;

			if(Object.keys(filter).length>0)
				findfilter.overallrating = filter;
		}

		return findfilter;
	}

	async getProductInfo(productid){
		var dbo = await this.mongo_handler.getDBObject();

		var productinfolist = await dbo.collection('productinfo').find({_id:productid}).toArray();

		return productinfolist[0];
	}

}

module.exports = CassaoneDao;