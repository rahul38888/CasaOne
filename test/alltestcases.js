var assert = require('assert');
const { query } = require('express');
const CassaoneDao = require('../scripts/casaonedao');

var dao = new CassaoneDao("mongodb://localhost:27017/","casaonedb_test");

const collection = "productinfo";

const test_products = [
	{"_id":1234,"productid":1234,"name":"Montauk Queen Bed Rustic Gray","color":"grey","assemblytime":51,"lastassemblies":[40,50,35,70,60],"pricepermonth":44},

	{"_id":1235,"productid":1235,"name":"Helix King Mattress White","color":"white","assemblytime":10,"lastassemblies":[10,20,5,5,10],"pricepermonth":36},

	{"_id":1236,"productid":1236,"name":"Hex 5 lb Dumbbell Black (Single Unit)","color":"black","pricepermonth":1},

	{"_id":1237,"productid":1237,"name":"Helix Queen Mattress White","color":"white","assemblytime":8,"lastassemblies":[10,10,5,5,10],"pricepermonth":27}
]

const queries = [
	{query:{sortby:"atime",sortorder:"desc"},result_count:4},
	{query:{},result_count:4},
	{query:{productid:1234},result_count:1},
	{query:{color:'white'},result_count:2},
	{query:{maxatime:10},result_count:2},
	{query:{minatime:11},result_count:1},
	{query:{minatime:9,maxatime:10},result_count:1}
];

before(async function () {
	var dbo = await dao.getdbObject();
	await dbo.dropCollection(collection);
	await dbo.createCollection(collection);

	test_products.forEach(async (product)=>{
		await dao.insertProductInfo(product);
	});
});

describe('Test cases', async function () {

	it('testGetProductInfo: Check existence of product, id '+test_products[0].productid, async function () {
		var productinfo = await dao.getProductInfo(test_products[0].productid).catch((error) => {
			console.error(error);
		});

		assert.notEqual(productinfo,undefined);
		assert.equal(productinfo.productid, test_products[0].productid);
		assert.equal(productinfo.name, test_products[0].name);
		assert.equal(productinfo.color, test_products[0].color);
		assert.equal(productinfo.assemblytime, test_products[0].assemblytime);
		assert.equal(productinfo.lastassemblies.length,
			productinfo.lastassemblies.length);

		productinfo.lastassemblies.every((val, i) => assert.equal(val,productinfo.lastassemblies[i]));

	});

	it('testAddNewAssemblyTime: Update product assembly time, id '+test_products[0].productid, async function () {

		await dao.addNewAssemblyTime(test_products[0].productid,30);

		var productinfo = await dao.getProductInfo(test_products[0].productid).catch((error) => {
			console.error(error);
		});

		assert.equal(productinfo.assemblytime, 49);
		assert.equal(productinfo.lastassemblies.length,
			productinfo.lastassemblies.length);

		var newatimes = [50,35,70,60,30];
		productinfo.lastassemblies.every((val, i) => assert.equal(val,newatimes[i]));
	});

	it('testProductListing: List all product after filter', async function () {

		queries.forEach(async (pair) =>{
			var query = pair.query;
			var expected_count = pair.result_count;

			var productlist = await dao.productListing(query).catch((error) => {console.error(error);});
			assert.equal(productlist.length,expected_count,"failed for "+ JSON.stringify(pair));
		});

	});
});

after(async function () {
	var dbo = await dao.getdbObject();
	await dbo.close;
});