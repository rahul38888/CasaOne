const { exist } = require('joi');
const CassaoneDao = require('./scripts/casaonedao');

var dao = new CassaoneDao("mongodb://localhost:27017/","casaonedb");

const collection = "productinfo";

const test_products = require("./resources/sampledata");

async function createSampleData(){
	try{
		var dbo = await dao.getdbObject();
		var collections = await dbo.listCollections({},{nameOnly:true}).toArray();

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
		exist;
	}
}

createSampleData();