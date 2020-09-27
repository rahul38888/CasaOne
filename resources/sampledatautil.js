const collection = "productinfo";

const test_products = require("./sampledata");

async function recreateSampleData(dao){
	try{
		var dbo = await dao.getdbObject();
		var collections = await dbo.listCollections({},{nameOnly:true}).toArray();


		console.info("--------- Initializing sample database : "+dao.mongo_handler.db_name +" ---------");
		collections.forEach(async (col)=>{
			console.info("Dropping: "+JSON.stringify(col));
			await dbo.dropCollection(col.name);
		});

		await dbo.createCollection(collection);

		test_products.forEach(async (product)=>{
			await dao.insertProductInfo(product);
		});
	}
	catch(e){
		console.error("Some error occurred white creating data");
		console.error(e);
	}
	finally{
		console.info("Sample data creation done.");
	}
}

module.exports = recreateSampleData;