var assert = require('assert');
const { Console } = require('console');
const { CassaoneDao } = require('../scripts/casaonedao');

var dao = new CassaoneDao("mongodb://localhost:27017/","casaonedb_test");

const collection = "productinfo";

const test_product = {
	"_id":1234,
	"productid":1234,
	"name":"Montauk Queen Bed Rustic Gray",
	"color":"grey",
	"assemblytime":51,
	"lastassemblies":[40,50,35,70,60]
};

before(async function () {
	var dbo = await dao.getdbObject();
	await dbo.dropCollection(collection);
	await dbo.createCollection(collection);

	dao.insertProductInfo(test_product);
});

describe('testGetProductInfo', async function () {
	it('Product with id 1234', async function () {
		var productinfo = await dao.getProductInfo(test_product.productid).catch((error) => {
			console.error(error);
		});

		assert.notEqual(productinfo,undefined);
		assert.equal(productinfo.productid, test_product.productid);
		assert.equal(productinfo.name, test_product.name);
		assert.equal(productinfo.color, test_product.color);
		assert.equal(productinfo.assemblytime, test_product.assemblytime);
		assert.equal(productinfo.lastassemblies.length,
			productinfo.lastassemblies.length);

		productinfo.lastassemblies.every((val, i) => assert.equal(val,productinfo.lastassemblies[i]));

	});
});

describe('testAddNewAssemblyTime', async function () {
	it('One document should be there', async function () {
		await dao.addNewAssemblyTime(test_product.productid,30).catch((error) => {
			console.error(error);
		});

		var productinfo = await dao.getProductInfo(test_product.productid).catch((error) => {
			console.error(error);
		});

		assert.equal(productinfo.assemblytime, 49);
		assert.equal(productinfo.lastassemblies.length,
			productinfo.lastassemblies.length);

		var newatimes = [50,35,70,60,30];
		productinfo.lastassemblies.every((val, i) => assert.equal(val,newatimes[i]));
	});
});

after(async function () {
	var dbo = await dao.getdbObject();
	await dbo.close;
});